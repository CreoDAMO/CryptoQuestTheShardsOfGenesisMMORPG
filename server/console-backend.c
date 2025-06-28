#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <microhttpd.h>
#include <jansson.h>
#include <curl/curl.h>
#include <openssl/evp.h>
#include <openssl/kdf.h>

#define PORT 8080
#define MAX_RESPONSE_SIZE 4096
#define WALLET_PREFIX "0x"
#define AWS_KMS_ENDPOINT "https://kms.us-east-1.amazonaws.com"
#define POLYGON_RPC "https://polygon-rpc.com"

// Response structure for CURL requests
struct Response {
    char *data;
    size_t size;
};

// Console account structure
typedef struct {
    char platform[16];
    char player_id[128];
    char wallet_address[43];
    char private_key_ref[256];
    int is_active;
} ConsoleAccount;

static size_t write_callback(void *contents, size_t size, size_t nmemb, void *userp) {
    size_t realsize = size * nmemb;
    struct Response *resp = (struct Response *)userp;
    
    resp->data = realloc(resp->data, resp->size + realsize + 1);
    if (!resp->data) return 0;
    
    memcpy(&(resp->data[resp->size]), contents, realsize);
    resp->size += realsize;
    resp->data[resp->size] = 0;
    
    return realsize;
}

// Generate custodial wallet address using KDF from console player ID
char *generate_wallet_address(const char *platform, const char *player_id) {
    unsigned char hash[32];
    char *seed = malloc(strlen(platform) + strlen(player_id) + 16);
    sprintf(seed, "cryptoquest_%s_%s_2025", platform, player_id);
    
    // Use PBKDF2 to generate deterministic address
    PKCS5_PBKDF2_HMAC(seed, strlen(seed), 
                      (unsigned char*)"polygon_salt", 12,
                      10000, EVP_sha256(), 32, hash);
    
    char *address = malloc(43);
    sprintf(address, "0x");
    for (int i = 12; i < 32; i++) {
        sprintf(address + 2 + (i-12)*2, "%02x", hash[i]);
    }
    
    free(seed);
    return address;
}

// Mock AWS KMS key generation (production would use actual AWS SDK)
char *create_kms_key(const char *platform, const char *player_id) {
    char *key_ref = malloc(256);
    sprintf(key_ref, "arn:aws:kms:us-east-1:123456789012:key/cryptoquest_%s_%s", 
            platform, player_id);
    return key_ref;
}

// Sign transaction using KMS (mock implementation)
char *sign_transaction_kms(const char *key_ref, const char *tx_data) {
    // In production, this would call AWS KMS to sign the transaction
    char *signature = malloc(132);
    sprintf(signature, "0x1234567890abcdef%s", tx_data + strlen(tx_data) - 60);
    return signature;
}

// Create console account endpoint
int handle_console_account(struct MHD_Connection *connection, 
                          const char *upload_data, size_t upload_data_size) {
    json_t *root = json_loadb(upload_data, upload_data_size, 0, NULL);
    if (!root) {
        const char *error_msg = "{\"error\":\"Invalid JSON\"}";
        struct MHD_Response *response = MHD_create_response_from_buffer(
            strlen(error_msg), (void*)error_msg, MHD_RESPMEM_PERSISTENT);
        int ret = MHD_queue_response(connection, MHD_HTTP_BAD_REQUEST, response);
        MHD_destroy_response(response);
        return ret;
    }
    
    json_t *platform_json = json_object_get(root, "platform");
    json_t *player_id_json = json_object_get(root, "playerId");
    
    if (!json_is_string(platform_json) || !json_is_string(player_id_json)) {
        const char *error_msg = "{\"error\":\"Missing platform or playerId\"}";
        struct MHD_Response *response = MHD_create_response_from_buffer(
            strlen(error_msg), (void*)error_msg, MHD_RESPMEM_PERSISTENT);
        int ret = MHD_queue_response(connection, MHD_HTTP_BAD_REQUEST, response);
        MHD_destroy_response(response);
        json_decref(root);
        return ret;
    }
    
    const char *platform = json_string_value(platform_json);
    const char *player_id = json_string_value(player_id_json);
    
    // Generate wallet address and KMS key
    char *wallet_address = generate_wallet_address(platform, player_id);
    char *kms_key = create_kms_key(platform, player_id);
    
    // Create response JSON
    json_t *response_json = json_object();
    json_object_set_new(response_json, "platform", json_string(platform));
    json_object_set_new(response_json, "playerId", json_string(player_id));
    json_object_set_new(response_json, "walletAddress", json_string(wallet_address));
    json_object_set_new(response_json, "kmsKeyRef", json_string(kms_key));
    json_object_set_new(response_json, "isActive", json_true());
    
    char *response_str = json_dumps(response_json, JSON_COMPACT);
    
    struct MHD_Response *response = MHD_create_response_from_buffer(
        strlen(response_str), response_str, MHD_RESPMEM_MUST_FREE);
    MHD_add_response_header(response, "Content-Type", "application/json");
    MHD_add_response_header(response, "Access-Control-Allow-Origin", "*");
    
    int ret = MHD_queue_response(connection, MHD_HTTP_OK, response);
    MHD_destroy_response(response);
    
    free(wallet_address);
    free(kms_key);
    json_decref(response_json);
    json_decref(root);
    
    return ret;
}

// Proxy blockchain transaction for console players
int handle_proxy_transaction(struct MHD_Connection *connection,
                           const char *upload_data, size_t upload_data_size) {
    json_t *root = json_loadb(upload_data, upload_data_size, 0, NULL);
    if (!root) {
        const char *error_msg = "{\"error\":\"Invalid JSON\"}";
        struct MHD_Response *response = MHD_create_response_from_buffer(
            strlen(error_msg), (void*)error_msg, MHD_RESPMEM_PERSISTENT);
        int ret = MHD_queue_response(connection, MHD_HTTP_BAD_REQUEST, response);
        MHD_destroy_response(response);
        return ret;
    }
    
    json_t *player_id_json = json_object_get(root, "playerId");
    json_t *contract_json = json_object_get(root, "contractAddress");
    json_t *function_json = json_object_get(root, "functionData");
    
    if (!json_is_string(player_id_json) || !json_is_string(contract_json) || 
        !json_is_string(function_json)) {
        const char *error_msg = "{\"error\":\"Missing required fields\"}";
        struct MHD_Response *response = MHD_create_response_from_buffer(
            strlen(error_msg), (void*)error_msg, MHD_RESPMEM_PERSISTENT);
        int ret = MHD_queue_response(connection, MHD_HTTP_BAD_REQUEST, response);
        MHD_destroy_response(response);
        json_decref(root);
        return ret;
    }
    
    const char *player_id = json_string_value(player_id_json);
    const char *contract_address = json_string_value(contract_json);
    const char *function_data = json_string_value(function_json);
    
    // Generate KMS key reference for this player
    char kms_key[256];
    sprintf(kms_key, "arn:aws:kms:us-east-1:123456789012:key/cryptoquest_console_%s", player_id);
    
    // Sign transaction using KMS
    char *signature = sign_transaction_kms(kms_key, function_data);
    
    // Submit transaction to Polygon network
    CURL *curl = curl_easy_init();
    if (!curl) {
        json_decref(root);
        return MHD_NO;
    }
    
    struct Response resp = { .data = malloc(1), .size = 0 };
    resp.data[0] = '\0';
    
    char payload[2048];
    sprintf(payload, 
        "{\"jsonrpc\":\"2.0\",\"method\":\"eth_sendRawTransaction\",\"params\":[\"%s\"],\"id\":1}",
        signature);
    
    curl_easy_setopt(curl, CURLOPT_URL, POLYGON_RPC);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, payload);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &resp);
    
    struct curl_slist *headers = NULL;
    headers = curl_slist_append(headers, "Content-Type: application/json");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    
    CURLcode res = curl_easy_perform(curl);
    
    json_t *response_json = json_object();
    if (res == CURLE_OK) {
        json_t *rpc_response = json_loads(resp.data, 0, NULL);
        if (rpc_response) {
            json_t *tx_hash = json_object_get(rpc_response, "result");
            if (json_is_string(tx_hash)) {
                json_object_set_new(response_json, "txHash", json_string(json_string_value(tx_hash)));
                json_object_set_new(response_json, "status", json_string("pending"));
            } else {
                json_object_set_new(response_json, "error", json_string("Transaction failed"));
            }
            json_decref(rpc_response);
        }
    } else {
        json_object_set_new(response_json, "error", json_string("Network error"));
    }
    
    char *response_str = json_dumps(response_json, JSON_COMPACT);
    
    struct MHD_Response *http_response = MHD_create_response_from_buffer(
        strlen(response_str), response_str, MHD_RESPMEM_MUST_FREE);
    MHD_add_response_header(http_response, "Content-Type", "application/json");
    MHD_add_response_header(http_response, "Access-Control-Allow-Origin", "*");
    
    int ret = MHD_queue_response(connection, MHD_HTTP_OK, http_response);
    MHD_destroy_response(http_response);
    
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
    free(resp.data);
    free(signature);
    json_decref(response_json);
    json_decref(root);
    
    return ret;
}

// Main request handler
static int handle_request(void *cls, struct MHD_Connection *connection,
                         const char *url, const char *method,
                         const char *version, const char *upload_data,
                         size_t *upload_data_size, void **con_cls) {
    
    // Handle CORS preflight
    if (strcmp(method, "OPTIONS") == 0) {
        struct MHD_Response *response = MHD_create_response_from_buffer(0, "", MHD_RESPMEM_PERSISTENT);
        MHD_add_response_header(response, "Access-Control-Allow-Origin", "*");
        MHD_add_response_header(response, "Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        MHD_add_response_header(response, "Access-Control-Allow-Headers", "Content-Type");
        int ret = MHD_queue_response(connection, MHD_HTTP_OK, response);
        MHD_destroy_response(response);
        return ret;
    }
    
    if (strcmp(method, "POST") != 0) return MHD_NO;
    
    if (*con_cls == NULL) {
        *con_cls = malloc(1);
        return MHD_YES;
    }
    
    if (*upload_data_size > 0) {
        if (strcmp(url, "/api/console-account") == 0) {
            return handle_console_account(connection, upload_data, *upload_data_size);
        } else if (strcmp(url, "/api/proxy-tx") == 0) {
            return handle_proxy_transaction(connection, upload_data, *upload_data_size);
        }
        
        *upload_data_size = 0;
        return MHD_YES;
    }
    
    const char *error_msg = "{\"error\":\"Endpoint not found\"}";
    struct MHD_Response *response = MHD_create_response_from_buffer(
        strlen(error_msg), (void*)error_msg, MHD_RESPMEM_PERSISTENT);
    int ret = MHD_queue_response(connection, MHD_HTTP_NOT_FOUND, response);
    MHD_destroy_response(response);
    
    return ret;
}

int main() {
    struct MHD_Daemon *daemon;
    
    printf("CryptoQuest Console Backend starting on port %d...\n", PORT);
    printf("Endpoints:\n");
    printf("  POST /api/console-account - Create custodial wallet\n");
    printf("  POST /api/proxy-tx - Proxy blockchain transactions\n");
    
    daemon = MHD_start_daemon(MHD_USE_SELECT_INTERNALLY, PORT, NULL, NULL,
                             &handle_request, NULL, MHD_OPTION_END);
    
    if (daemon == NULL) {
        printf("Failed to start daemon\n");
        return 1;
    }
    
    printf("Server running. Press enter to terminate.\n");
    getchar();
    
    MHD_stop_daemon(daemon);
    return 0;
}
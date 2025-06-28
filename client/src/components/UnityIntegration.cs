using UnityEngine;
using Nethereum.Web3;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Contracts;
using System.Numerics;
using System.Threading.Tasks;
using System.Collections;
using UnityEngine.Networking;

public class CryptoQuestGame : MonoBehaviour
{
    [Header("Blockchain Configuration")]
    public string polygonRpcUrl = "https://polygon-rpc.com";
    public string backendApiUrl = "https://api.cryptoquest.game";
    
    [Header("Contract Addresses")]
    public string mmorpgAddress = "0x251ace49f2b106e0746702986e879e404a76f290";
    public string nftAddress = "0xc641573148e62d88a2374ffe97391f849cea8ff5";
    public string tokenAddress = "0x123..."; // Token contract address
    public string stakingAddress = "0x456..."; // Staking contract address
    
    [Header("Console Integration")]
    public bool isConsoleMode = false;
    public string consolePlatform = "pc"; // "ps5", "xbox", "pc"
    public string consolePlayerId = "";
    
    private Web3 web3;
    private string playerAccount;
    private PlayerData currentPlayer;
    private bool isInitialized = false;
    
    // Player data structure matching blockchain
    [System.Serializable]
    public class PlayerData
    {
        public string playerName;
        public string characterName;
        public BigInteger level;
        public BigInteger experience;
        public BigInteger health;
        public BigInteger mana;
        public string[] inventory;
        public string avatarUrl;
    }
    
    // Ready Player Me avatar integration
    [Header("Avatar System")]
    public GameObject avatarContainer;
    public string readyPlayerMeUrl = "";
    
    async void Start()
    {
        await InitializeBlockchain();
        await LoadPlayerData();
        
        // Setup console-specific features
        if (isConsoleMode)
        {
            await SetupConsoleIntegration();
        }
        
        // Initialize Ready Player Me avatar if URL provided
        if (!string.IsNullOrEmpty(readyPlayerMeUrl))
        {
            await LoadReadyPlayerMeAvatar();
        }
    }
    
    async Task InitializeBlockchain()
    {
        try
        {
            if (isConsoleMode)
            {
                // Console mode uses backend proxy
                Debug.Log($"Initializing console mode for {consolePlatform}");
                await CreateConsoleAccount();
            }
            else
            {
                // PC/Mobile mode uses direct Web3
                web3 = new Web3(polygonRpcUrl);
                // In real implementation, connect to MetaMask or WalletConnect
                playerAccount = "0x..."; // Get from wallet connection
            }
            
            isInitialized = true;
            Debug.Log("Blockchain initialization complete");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Blockchain initialization failed: {e.Message}");
        }
    }
    
    async Task CreateConsoleAccount()
    {
        var requestData = new
        {
            platform = consolePlatform,
            playerId = consolePlayerId
        };
        
        string jsonData = JsonUtility.ToJson(requestData);
        
        using (UnityWebRequest request = UnityWebRequest.PostWwwForm($"{backendApiUrl}/console-account", ""))
        {
            byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonData);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            
            await request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                var response = JsonUtility.FromJson<ConsoleAccountResponse>(request.downloadHandler.text);
                playerAccount = response.walletAddress;
                Debug.Log($"Console account created: {playerAccount}");
            }
            else
            {
                Debug.LogError($"Console account creation failed: {request.error}");
            }
        }
    }
    
    [System.Serializable]
    public class ConsoleAccountResponse
    {
        public string platform;
        public string playerId;
        public string walletAddress;
        public string kmsKeyRef;
        public bool isActive;
    }
    
    async Task LoadPlayerData()
    {
        if (!isInitialized || string.IsNullOrEmpty(playerAccount)) return;
        
        try
        {
            if (isConsoleMode)
            {
                // Load via backend API
                await LoadPlayerDataFromBackend();
            }
            else
            {
                // Load directly from blockchain
                await LoadPlayerDataFromBlockchain();
            }
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Failed to load player data: {e.Message}");
        }
    }
    
    async Task LoadPlayerDataFromBackend()
    {
        using (UnityWebRequest request = UnityWebRequest.Get($"{backendApiUrl}/players/wallet/{playerAccount}"))
        {
            await request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                currentPlayer = JsonUtility.FromJson<PlayerData>(request.downloadHandler.text);
                UpdateGameUI();
            }
        }
    }
    
    async Task LoadPlayerDataFromBlockchain()
    {
        var contract = web3.Eth.GetContract(GetMMORPGABI(), mmorpgAddress);
        var getPlayerFunction = contract.GetFunction("getPlayer");
        
        var playerResult = await getPlayerFunction.CallAsync<PlayerData>(playerAccount);
        currentPlayer = playerResult;
        UpdateGameUI();
    }
    
    async Task LoadReadyPlayerMeAvatar()
    {
        using (UnityWebRequest request = UnityWebRequest.Get(readyPlayerMeUrl))
        {
            await request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                // Load GLB model from Ready Player Me
                var avatarData = request.downloadHandler.data;
                await InstantiateAvatar(avatarData);
            }
        }
    }
    
    async Task InstantiateAvatar(byte[] avatarData)
    {
        // Use GLTFast or similar to load Ready Player Me GLB model
        // This would require additional Unity packages for GLB loading
        Debug.Log("Avatar loaded successfully");
        
        // Apply avatar to avatarContainer
        if (avatarContainer != null)
        {
            // Avatar instantiation logic here
        }
    }
    
    // Blockchain interaction methods
    public async Task CompleteQuest(int questId)
    {
        if (!isInitialized) return;
        
        try
        {
            if (isConsoleMode)
            {
                await ProxyBlockchainTransaction("completeQuest", new object[] { questId });
            }
            else
            {
                var contract = web3.Eth.GetContract(GetMMORPGABI(), mmorpgAddress);
                var completeQuestFunction = contract.GetFunction("completeQuest");
                await completeQuestFunction.SendTransactionAsync(playerAccount, questId);
            }
            
            Debug.Log($"Quest {questId} completed successfully");
            await LoadPlayerData(); // Refresh player data
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Quest completion failed: {e.Message}");
        }
    }
    
    public async Task MintCharacterNFT(string characterName, string race, string armor, string appearance)
    {
        if (!isInitialized) return;
        
        try
        {
            var tokenId = System.DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            
            if (isConsoleMode)
            {
                await ProxyBlockchainTransaction("mintCharacter", 
                    new object[] { playerAccount, tokenId, race, armor, appearance, readyPlayerMeUrl });
            }
            else
            {
                var contract = web3.Eth.GetContract(GetNFTABI(), nftAddress);
                var mintFunction = contract.GetFunction("mintCharacter");
                await mintFunction.SendTransactionAsync(playerAccount, 
                    playerAccount, tokenId, race, armor, appearance, readyPlayerMeUrl);
            }
            
            Debug.Log("Character NFT minted successfully");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"NFT minting failed: {e.Message}");
        }
    }
    
    async Task ProxyBlockchainTransaction(string functionName, object[] parameters)
    {
        var requestData = new
        {
            playerId = consolePlayerId,
            contractAddress = mmorpgAddress,
            functionName = functionName,
            parameters = parameters
        };
        
        string jsonData = JsonUtility.ToJson(requestData);
        
        using (UnityWebRequest request = UnityWebRequest.PostWwwForm($"{backendApiUrl}/proxy-tx", ""))
        {
            byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonData);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            
            await request.SendWebRequest();
            
            if (request.result != UnityWebRequest.Result.Success)
            {
                throw new System.Exception($"Proxy transaction failed: {request.error}");
            }
        }
    }
    
    // Platform-specific optimizations
    async Task SetupConsoleIntegration()
    {
        switch (consolePlatform.ToLower())
        {
            case "ps5":
                await SetupPS5Features();
                break;
            case "xbox":
                await SetupXboxFeatures();
                break;
            default:
                Debug.Log("PC mode - direct Web3 integration");
                break;
        }
    }
    
    async Task SetupPS5Features()
    {
        Debug.Log("Setting up PS5-specific features:");
        Debug.Log("- DualSense haptic feedback for combat");
        Debug.Log("- Ray tracing for enhanced visuals");
        Debug.Log("- SSD optimization for instant loading");
        Debug.Log("- Exclusive Samurai Saga questline available");
        
        // Enable PS5-specific features
        Application.targetFrameRate = 60; // Ensure 60 FPS for TRC compliance
        
        // Setup haptic feedback integration
        // This would use PS5 SDK features in actual implementation
    }
    
    async Task SetupXboxFeatures()
    {
        Debug.Log("Setting up Xbox-specific features:");
        Debug.Log("- Smart Delivery optimization");
        Debug.Log("- Quick Resume support");
        Debug.Log("- Game Pass integration");
        Debug.Log("- Exclusive Knights Crusade tournament available");
        
        // Enable Xbox-specific features
        Application.targetFrameRate = 60; // Ensure performance standards
        
        // Setup Xbox Live integration
        // This would use Xbox SDK features in actual implementation
    }
    
    void UpdateGameUI()
    {
        if (currentPlayer == null) return;
        
        // Update Unity UI elements with player data
        Debug.Log($"Player: {currentPlayer.playerName}");
        Debug.Log($"Character: {currentPlayer.characterName}");
        Debug.Log($"Level: {currentPlayer.level}");
        Debug.Log($"Experience: {currentPlayer.experience}");
        Debug.Log($"Health: {currentPlayer.health}");
        Debug.Log($"Mana: {currentPlayer.mana}");
    }
    
    // Contract ABI getters (simplified - in real implementation these would be full ABIs)
    string GetMMORPGABI()
    {
        return "[{\"inputs\":[],\"name\":\"getPlayer\",\"outputs\":[],\"type\":\"function\"}]";
    }
    
    string GetNFTABI()
    {
        return "[{\"inputs\":[],\"name\":\"mintCharacter\",\"outputs\":[],\"type\":\"function\"}]";
    }
}

// Extension method for async UnityWebRequest
public static class UnityWebRequestExtensions
{
    public static System.Threading.Tasks.Task<UnityWebRequest> SendWebRequest(this UnityWebRequest request)
    {
        var tcs = new System.Threading.Tasks.TaskCompletionSource<UnityWebRequest>();
        request.SendWebRequest().completed += _ => tcs.SetResult(request);
        return tcs.Task;
    }
}
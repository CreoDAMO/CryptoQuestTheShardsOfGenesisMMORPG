import React, { useState } from 'react';
import { 
  Shield, 
  Plus, 
  Copy, 
  ExternalLink, 
  Users, 
  Lock, 
  Check,
  AlertCircle
} from 'lucide-react';

interface SafeSetupProps {
  currentOwnerAddress?: string;
  onAddressUpdate?: (address: string) => void;
}

export function SafeMultisigSetup({ currentOwnerAddress, onAddressUpdate }: SafeSetupProps) {
  const [ownerAddress, setOwnerAddress] = useState(currentOwnerAddress || '');
  const [signerAddresses, setSignerAddresses] = useState<string[]>(['', '']);
  const [threshold, setThreshold] = useState(2);
  const [networks, setNetworks] = useState(['polygon', 'base']);

  const handleAddSigner = () => {
    setSignerAddresses([...signerAddresses, '']);
  };

  const handleSignerChange = (index: number, value: string) => {
    const newSigners = [...signerAddresses];
    newSigners[index] = value;
    setSignerAddresses(newSigners);
  };

  const handleRemoveSigner = (index: number) => {
    const newSigners = signerAddresses.filter((_, i) => i !== index);
    setSignerAddresses(newSigners);
  };

  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const getTotalSigners = () => {
    return 1 + signerAddresses.filter(addr => addr.length > 0).length; // +1 for owner
  };

  const isValidConfiguration = () => {
    return (
      isValidAddress(ownerAddress) &&
      threshold > 0 &&
      threshold <= getTotalSigners() &&
      signerAddresses.some(addr => isValidAddress(addr))
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            SafeGlobal MultiSig Setup
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Configure your treasury management with multi-signature security
          </p>
        </div>
      </div>

      {/* Owner Address Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Primary Owner Address
        </label>
        <div className="relative">
          <input
            type="text"
            value={ownerAddress}
            onChange={(e) => {
              setOwnerAddress(e.target.value);
              onAddressUpdate?.(e.target.value);
            }}
            placeholder="0x... (Your new wallet address)"
            className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {isValidAddress(ownerAddress) && (
            <Check className="absolute right-3 top-3 w-4 h-4 text-green-500" />
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          This will be your primary signing address with CQT tokens and LP positions
        </p>
      </div>

      {/* Additional Signers */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Additional Signers (Optional)
        </label>
        <div className="space-y-3">
          {signerAddresses.map((address, index) => (
            <div key={index} className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => handleSignerChange(index, e.target.value)}
                placeholder={`0x... (Signer ${index + 2} address)`}
                className="w-full p-3 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="absolute right-3 top-3 flex gap-1">
                {isValidAddress(address) && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
                <button
                  onClick={() => handleRemoveSigner(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          
          <button
            onClick={handleAddSigner}
            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Another Signer
          </button>
        </div>
      </div>

      {/* Threshold Configuration */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Signature Threshold
        </label>
        <div className="flex items-center gap-4">
          <select
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {Array.from({ length: getTotalSigners() }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            of {getTotalSigners()} signatures required
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Recommended: 2-of-3 for security and convenience
        </p>
      </div>

      {/* Network Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Networks
        </label>
        <div className="flex gap-2">
          {['polygon', 'base', 'ethereum'].map(network => (
            <button
              key={network}
              onClick={() => {
                if (networks.includes(network)) {
                  setNetworks(networks.filter(n => n !== network));
                } else {
                  setNetworks([...networks, network]);
                }
              }}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                networks.includes(network)
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {network.charAt(0).toUpperCase() + network.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Configuration Summary</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Signers:</span>
            <span className="text-gray-900 dark:text-white">{getTotalSigners()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Required Signatures:</span>
            <span className="text-gray-900 dark:text-white">{threshold}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Networks:</span>
            <span className="text-gray-900 dark:text-white">{networks.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Status and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isValidConfiguration() ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">Ready to deploy</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-yellow-600 dark:text-yellow-400">Configuration incomplete</span>
            </>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => window.open('https://app.safe.global', '_blank')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Create Safe
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Setup Instructions:</h4>
        <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
          <li>Complete your wallet addresses above</li>
          <li>Click "Create Safe" to open SafeGlobal</li>
          <li>Use the addresses and threshold configuration above</li>
          <li>Deploy on your selected networks</li>
          <li>Return here to update the system with your Safe address</li>
        </ol>
      </div>

      {/* Signature Requirements Info */}
      {getTotalSigners() === 1 && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Single Signature Setup</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                You can use a single signature for now, but consider adding additional signers for enhanced security of your treasury operations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
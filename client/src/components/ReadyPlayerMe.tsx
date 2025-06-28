import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReadyPlayerMeProps {
  onAvatarCreated: (avatarUrl: string) => void;
  isLoading?: boolean;
}

const READY_PLAYER_ME_URL = 'https://cryptoquest.readyplayer.me/avatar?frameApi';

export function ReadyPlayerMe({ onAvatarCreated, isLoading = false }: ReadyPlayerMeProps) {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isCreatorVisible, setIsCreatorVisible] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://cryptoquest.readyplayer.me') return;
      
      const { data } = event;
      if (data.source === 'ready-player-me' && data.eventName === 'v1.avatar.export') {
        const newAvatarUrl = data.data.url;
        setAvatarUrl(newAvatarUrl);
        onAvatarCreated(newAvatarUrl);
        setIsCreatorVisible(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAvatarCreated]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🎮</span>
          Ready Player Me Avatar Creator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isCreatorVisible && !avatarUrl && (
          <div className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Create your unique 3D avatar for CryptoQuest. Compatible with PS5, Xbox, and PC platforms.
            </p>
            <Button 
              onClick={() => setIsCreatorVisible(true)}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              Create Avatar
            </Button>
          </div>
        )}

        {isCreatorVisible && (
          <div className="space-y-4">
            <iframe
              src={READY_PLAYER_ME_URL}
              className="w-full h-96 border-2 border-purple-500 rounded-lg"
              title="Ready Player Me Avatar Creator"
              allow="camera *; microphone *"
            />
            <Button 
              variant="outline" 
              onClick={() => setIsCreatorVisible(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        )}

        {avatarUrl && (
          <div className="text-center space-y-4">
            <div className="relative">
              <img 
                src={avatarUrl} 
                alt="Created Avatar" 
                className="w-32 h-32 mx-auto rounded-full border-4 border-purple-500"
              />
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                ✓
              </div>
            </div>
            <p className="text-green-600 dark:text-green-400 font-medium">
              Avatar created successfully! Ready for console deployment.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setAvatarUrl('');
                setIsCreatorVisible(true);
              }}
              disabled={isLoading}
            >
              Create New Avatar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
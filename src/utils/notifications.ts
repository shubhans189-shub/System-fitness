export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (e) {
    return false;
  }
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function sendPushNotification(title: string, body: string, options?: { tag?: string; requireInteraction?: boolean }) {
  if (typeof window === 'undefined') return;

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: options?.tag || 'system-quest',
        requireInteraction: options?.requireInteraction ?? false,
      });
      return;
    } catch (e) {
      console.warn('Native notification failed, falling back to in-app notification', e);
    }
  }
}

export function checkDailyQuestSchedule(
  allCompleted: boolean,
  currentHour: number = new Date().getHours()
): { shouldNotify: boolean; title: string; body: string; isPenaltyWarning: boolean } | null {
  if (allCompleted) return null;

  if (currentHour >= 21) {
    return {
      shouldNotify: true,
      title: '🚨 [PENALTY QUEST IMMINENT]',
      body: 'Hunter! Less than 3 hours remain before midnight. Complete your daily physical quest or face survival punishment in the Penalty Zone!',
      isPenaltyWarning: true,
    };
  } else if (currentHour >= 18) {
    return {
      shouldNotify: true,
      title: '⚠️ [SYSTEM ALERT: INCOMPLETE QUEST]',
      body: 'Evening training check: Your daily quest awaits. Keep your streak alive and awaken greater strength.',
      isPenaltyWarning: false,
    };
  } else if (currentHour === 9) {
    return {
      shouldNotify: true,
      title: '⚔️ [NEW DAILY QUEST ARRIVED]',
      body: 'The System has issued your daily physical training protocol. Begin your workout to earn XP and stat points.',
      isPenaltyWarning: false,
    };
  }

  return null;
}

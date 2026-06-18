const AUTO_LOCK_ALARM = "qs_auto_lock";
const AUTO_LOCK_MINUTES = 15;

async function lockNow(): Promise<void> {
  await chrome.storage.session.remove("qs_unlocked_wallet");
}

chrome.runtime.onMessage.addListener((message: { type?: string }) => {
  if (message?.type === "qs_activity_ping") {
    chrome.alarms.create(AUTO_LOCK_ALARM, { delayInMinutes: AUTO_LOCK_MINUTES });
  }
  if (message?.type === "qs_lock_now") {
    void lockNow();
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === AUTO_LOCK_ALARM) {
    void lockNow();
  }
});

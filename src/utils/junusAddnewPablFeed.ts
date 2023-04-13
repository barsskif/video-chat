/* eslint-disable */

export const junusAddnewPablFeed = (msg: any, newRemoteFeed: any) => {
  const list = msg['publishers'];
  console.log('Получил список доступных издателей/потоков:', list);
  for (let f in list) {
    const id = list[f]['id'];
    const display = list[f]['display'];
    const audio = list[f]['audio_codec'];
    const video = list[f]['video_codec'];
    console.log('  >> [' + id + '] ' + display + ' (audio: ' + audio + ', video: ' + video + ')');
    newRemoteFeed(id, display, audio, video);
  }
};

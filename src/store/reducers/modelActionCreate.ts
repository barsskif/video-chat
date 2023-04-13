export interface IDeleteRoom {
  hash: string;
  userEmail: string;
}

export interface IAddMeeting {
  meetingName: string;
  publishers?: number;
}

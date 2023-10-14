export interface IResponseV2 {
  status?: string,
  message?: string
  result?: IVideoInfor
}

export interface IVideoInfor {
  type: string;
  desc: string;
  author: IAuthor;
  statistics: IVideoStat;
  video: string;
  music: string;
}

export interface IAuthor {
  avatar: string;
  nickname: string;
}

export interface IVideoStat {
  likeCount: string;
  commentCount: string;
  shareCount: string;
}
export type DataItem = {
    id: number;
    title?: string;
    image: string;
};

export type ServerToClient = { id: number; image: string };
export type ClientToServer = { id: number; hash: string | null };
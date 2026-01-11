export type Trip = {
  id: string;
  name: string;
  createdBy: string;   // uid
  members: string[];   // array de uid
  joinCode: string;
  createdAt: Date;
};

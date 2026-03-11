import axios from "axios";

const agents = {
  web: "http://localhost:8001",
  file: "http://localhost:8002",
  os: "http://localhost:8003",
};

export async function callAgent(agent: string, payload: any) {
  const url = agents[agent];

  const res = await axios.post(url, payload);

  return res.data;
}

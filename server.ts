const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

import { ServerHold } from "./src/classes/structure/server/ServerHold";

const HostServer = new ServerHold();
console.log("Server " + HostServer.PortNum + " is awake.")

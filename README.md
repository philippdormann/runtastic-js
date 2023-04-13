# @philippdormann/runtastic-js
## Installation
```
pnpm i runtastic-js
```
## Usage
```
import { getRunSessions } from "runtastic-js";
const sessions = await getRunSessions({ username: "", password: "" });
console.log(sessions);
```
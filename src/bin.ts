#!/usr/bin/env node
import { main } from "@silvermoon-work/ipfspawn";
process.exitCode = await main(process.argv.slice(2));

# 2009scape NPC Viewer

This is a simple NPC viewer for 2009scape. Simply view the index.html with a webserver to use the tool.

## Tools

Included is `cache2json.py`. It takes 2 files as input: `npc_configs.json` from the 2009scape server repo, and `every_2009_npc.txt` which is created by running RSDS clicking "NPC Def" and dumping every NPC.

All `cache2json.py` does is add combat level to `npc_configs.json` and converts it to a dictionary.
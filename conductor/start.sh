#!/bin/bash
cd /root/conductor-agent
gunicorn -w 4 -b 127.0.0.1:4998 agent:app

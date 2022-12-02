#!/bin/bash

# ps -ef|grep com.example.springboot.Application| grep -v grep 
processIdToKill=$(ps -ef|grep com.example.springboot.Application| grep -v grep | awk '{print $2 }') 
#     ^^^^^^ unix command to get all processes on system. returns many lines
#            ^^^^ extract the line with this string
#                                                                    ^^^ grab second word on the line
echo killing process: $processIdToKill
kill -9 $processIdToKill  
processIdToKill=$(ps -ef|grep react| grep -v grep | awk '{print $2 }') 
echo killing process: $processIdToKill
kill -9 $processIdToKill  

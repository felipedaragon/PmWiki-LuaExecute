<?php if (!defined('PmWiki')) exit();
/**
 * PmWiki Lua Execute Recipe
 *  Copyright (c) 2014 Felipe Daragon
 * Lua VM JavaScript
 *  Copyright (c) 2013 Alon Zakai
 * 
 * License: MIT
 */
$RecipeInfo['LuaExecute']['1.0.1'] = '2014-02-07';

// Defaults
SDVA($LuaConfig, array(
        'initscript' => '',
         'safemode' => true
        ));

// Internal variables
$LuaHeaderInserted = false;

function InsertLuaHeader(){
     global $LuaHeaderInserted, $LuaConfig, $FarmPubDirUrl, $HTMLHeaderFmt, $HTMLFooterFmt;
     $LuaHeaderInserted = true;
     $initscript = $LuaConfig['initscript'];
     if ($initscript != '') $initscript = EncodeLuaScript($initscript);
     if ($LuaConfig['safemode'] == false) $script = "<script>LuaExecutor.enableSafeMode(false);</script>";
     $HTMLHeaderFmt['luahead'] = "
  <script type='text/javascript' src='{$FarmPubDirUrl}/lua/luaexecute.js'></script>{$script}
  ";
     $HTMLFooterFmt['luafoot'] = "
  <script type='text/javascript' src='{$FarmPubDirUrl}/lua/lua.vm.js'></script>
  <script>LuaExecutor.run('{$initscript}');</script>
  ";
    }

function EncodeLuaScript($s){
     $s = html_entity_decode($s);
     return base64_encode($s);
    }

function ExecuteLuaScript($args){
     global $LuaHeaderInserted;
     if ($LuaHeaderInserted == false) InsertLuaHeader();
     $code = PSS($args);
     $code = str_replace('<:vspace>', '', $code);
     $code = EncodeLuaScript($code);
     return Keep("<div class='luaoutput' luacode='{$code}'></div>");
    }

Markup(
    'lua',
     'fulltext',
     '/\\(:lua:\\)(.*?)\\(:luaend:\\)/mesi',
     "ExecuteLuaScript('$1')"
    );

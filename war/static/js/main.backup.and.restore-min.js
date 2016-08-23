var backupAndRestore={v:{backupForm:"backupForm",tableId:"backupAndRestoreTable",listTableId:"backupAndRestoreListTable",webCrawlerId:null,siteId:null,webCrawlerUrl:null,interval:null,time:null},fn:{init:function(){if(backupAndRestore.v.interval){clearInterval(backupAndRestore.v.interval)}var b=new Date();backupAndRestore.v.time=b.getTime();var f=siteJsonData;var e="<ul>";for(var c in f){if(isNaN(c)){continue}var d=f[c]["id"];var a=f[c]["name"];e=e+"<li><input id='siteId' type='checkbox' name='siteId' value='"+d+"'/>"+a+"</li>"}e=e+"</ul>";$("#"+backupAndRestore.v.backupForm).find("#siteCheckboxListDiv").html(e)},backup:function(){var h="";var g=$("#"+backupAndRestore.v.backupForm).find(":checkbox[name=siteId]");for(var e=0,b=g.length;e<b;e++){if(g[e].checked){if(h===""){h=g[e].value}else{h+=","+g[e].value}}}var a="";var g=$("#"+backupAndRestore.v.backupForm).find(":checkbox[name=backModules]");for(var e=0,b=g.length;e<b;e++){if(g[e].checked){if(a==""){a=g[e].value}else{a+=","+g[e].value}}}var d=getCheckbox(backupAndRestore.v.backupForm,"backPrivate");var f=$("#"+backupAndRestore.v.backupForm).find("#remark").val();showLoading($("#"+backupAndRestore.v.backupForm));jsonrpc.backupService.backup(function(c,i,j){removeLoading($("#"+backupAndRestore.v.backupForm));if(i){return}var k=c;if(k){showInfo(nc.i18n("res.backup"));backupAndRestore.fn.query()}},backupAndRestore.v.webCrawlerId,h,a,d,f)},restore:function(a){showInfo(nc.i18n("res.restore"));jsonrpc.backupService.restore(function(b,c,d){if(c){return}if(b){setTimeout(function(){showInfo(nc.i18n("res.restore.success"));if(isLocal()){freshWebCrawlerNode(backupAndRestore.v.webCrawlerId)}else{jsonrpc.systemResetService.resetCache(function(e,f,g){freshWebCrawlerNode(backupAndRestore.v.webCrawlerId)})}},1500)}else{showInfo(nc.i18n("res.restore.failure"))}},backupAndRestore.v.webCrawlerId,null,a)},selectAll:function(b,c,a){$("#"+c).find("input[type=checkbox][name='"+a+"']").each(function(){this.checked=b.checked})},autoRefresh:function(){backupAndRestore.v.interval=setInterval(function(){backupAndRestore.fn.refresh()},2000)},refresh:function(){var ids="";$("#"+backupAndRestore.v.tableId+" #"+backupAndRestore.v.listTableId).find("tr:not(:first)").each(function(){var status=$(this).find("#status").val();if(status!="1"){var backId=$(this).find("#backId").val();if(ids!=""){ids+=","}ids+=backId}});if(ids!=""){jsonrpc.backupService.refresh(function(result,exception,profile){if(exception){return}var data=result;if(data==null){return}data=eval(data);var hasRun=false;for(var i in data){if(isNaN(i)){continue}var isRun=backupAndRestore.fn.updateRow(data[i]);hasRun=(hasRun||isRun)}if(!hasRun){showInfo(nc.i18n("res.backup.finished"));clearInterval(backupAndRestore.v.interval)}},backupAndRestore.v.webCrawlerId,ids)}else{clearInterval(backupAndRestore.v.interval)}},updateRow:function(d){var e=d.id;var a="#tr_"+backupAndRestore.v.time+"_"+e;var c=true;var b=d.status;if(b=="1"){c=false;statusDesc=nc.i18n("res.finished");$("#"+backupAndRestore.v.tableId+" #"+backupAndRestore.v.listTableId).find(a).find("#status").val(b);$("#"+backupAndRestore.v.tableId+" #"+backupAndRestore.v.listTableId).find(a).find(".statusDesc").text(statusDesc)}return c},query:function(){moveAllTr(backupAndRestore.v.listTableId);queryLoading(backupAndRestore.v.listTableId);jsonrpc.backupService.query(function(result,exception,profile){if(exception){removeLoading($("#"+backupAndRestore.v.backupForm));return}moveAllTr(backupAndRestore.v.listTableId);var baseUrl=backupAndRestore.v.webCrawlerUrl;if(baseUrl==null||baseUrl==undefined){baseUrl="../../"}var data=result;data=eval(data);for(var i in data){if(isNaN(i)){continue}var id=data[i]["id"];var time=data[i]["createDate"];var filename=data[i]["filename"];var downurl=baseUrl+"file"+filename;var remark=data[i]["remark"];var status=data[i]["status"];var statusDesc=nc.i18n("res.backup");if(status=="1"){statusDesc=nc.i18n("res.finished")}backupAndRestore.fn.addRow(id,time,filename,downurl,remark,status,statusDesc)}removeLoading($("#"+backupAndRestore.v.backupForm));backupAndRestore.fn.autoRefresh()},backupAndRestore.v.webCrawlerId,null)},addRow:function(h,e,c,g,f,b,d){var a="<tr class='simplehighlight' id='tr_"+backupAndRestore.v.time+"_"+h+"'>";a+="<td nowrap>"+e+"</td>";a+="<td nowrap>"+c+"</td>";a+="<td nowrap>"+f+"</td>";a+='<td nowrap class="statusDesc">'+d+"</td>";a+='<td nowrap><input type="hidden" id="status" value="'+b+'"/><input type="hidden" id="backId" value="'+h+'"/><a href="javascript:void(0)" onclick=backupAndRestore.fn.downloadFile(\''+g+"') title=\""+g+'">'+nc.i18n("res.download")+'</a> | <a href="javascript:void(0)" onclick=backupAndRestore.fn.remove('+h+")>"+nc.i18n("res.remove")+'</a> | <a href="javascript:void(0)" onclick=backupAndRestore.fn.restore(\''+c+"')>"+nc.i18n("res.restitute")+"</a></td>";a+="</tr>";$(a).appendTo("#"+backupAndRestore.v.listTableId);$("#"+backupAndRestore.v.listTableId+" tr:even").css("background","#EEE");$("#"+backupAndRestore.v.listTableId+" tr:odd").css("background","#FFFFFF");$("#"+backupAndRestore.v.listTableId+" .simplehighlight").hover(function(){$(this).children().addClass("datahighlight")},function(){$(this).children().removeClass("datahighlight")})},remove:function(a){if(a==null||a.length==0){showInfo(nc.i18n("res.params.errors"));return}if(!confirm(nc.i18n("res.remove.confirm"))){return}showLoading($("#"+backupAndRestore.v.tableId));jsonrpc.backupService.remove(function(b,c,d){removeLoading($("#"+backupAndRestore.v.tableId));if(c){return}var e=b;if(e){backupAndRestore.fn.query();showInfo(nc.i18n("res.remove.success"));return}showInfo(e)},backupAndRestore.v.webCrawlerId,a)},showRequest:function(d,a,b){var c=$("#"+backupAndRestore.v.tableId).find("#fileToUpload").val();if(c==null||c==""){showInfo(nc.i18n("res.selectFile"));return false}$("#"+backupAndRestore.v.tableId).find("#msgOutput").html("Uploading...")},showResponse:function(a,b){setTimeout(function(){backupAndRestore.fn.callback(a)},3000)},callback:function(a){if(a.code=="200"){$("#"+backupAndRestore.v.tableId).find("#msgOutput").html(a.message);jsonrpc.systemResetService.resetCache(function(b,c,d){freshWebCrawlerNode(backupAndRestore.v.webCrawlerId)})}else{if(a.code=="401"){showInfo(a.message)}else{if(a.code=="501"){$("#"+share.v.formId).find("#msgOutput").html(a.message)}else{$("#"+backupAndRestore.v.tableId).find("#msgOutput").html(nc.i18n("res.file.upload.failure"));$("#trace-box #trace").html(a.message);$("#trace-box").dialog("open")}}}},downloadFile:function(c){if(isLocal()){$("#"+backupAndRestore.v.tableId).find("#proxyFrame").attr("src",c);return}c=BASE64.encode(c);var a=c.length;var b="";for(var d=a-1;d>=0;d--){b+=c.charAt(d)}var e="../../member/file/proxydownload?u="+b;$("#"+backupAndRestore.v.tableId).find("#proxyFrame").attr("src",e)}}};
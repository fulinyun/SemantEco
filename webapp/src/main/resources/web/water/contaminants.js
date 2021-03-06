//from USGS
var appBase =parseParent(window.location.href); //= "http://localhost/water/";
var codesWindow;
var initTag=true;
var num_source=1;
var elementArr = [];
var delim =';';
var noFilterForCharacteristicFlag=true;

function requestElementsCounty(){
	//alert("In requestElementsCounty");
	if(data_source["EPA"]==1 && data_source["USGS"]==1)
		num_source=2;
	if(data_source["USGS"]==1)
	requestUSGSElementsPerCounty("RI", "44", "3");
	if(data_source["EPA"]==1)
		requestEPAElementsPerCounty("RI", "3");
}

function requestUSGSElementsPerCounty(stateAbbr, stateCode, countyCode){
	//alert("In requestUSGSElementsPerCounty");
	var thisserviceagent="http://localhost/demoWater/trendData.php";
var sparqlUSGSElements ="PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\r\n"+
        "PREFIX epa: <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#>\r\n"+
        "\r\n"+
        "SELECT DISTINCT ?element\r\n"+
        "WHERE {\r\n"+
        //"graph <http://tw2.tw.rpi.edu/water/RI/USGS>\r\n"+
        "graph <http://tw2.tw.rpi.edu/water/"+stateAbbr+"/USGS>\r\n"+
        "{\r\n"+
        "?site rdf:type epa:MeasurementSite .\r\n"+
        //"?site epa:hasStateCode "44" .\r\n"+
        //"?site epa:hasCountyCode "3" .\r\n"+
        "?site epa:hasStateCode \"" + stateCode + "\" .\r\n"+
        "?site epa:hasCountyCode \"" + countyCode + "\" .\r\n"+
        "?site epa:hasUSGSSiteId ?siteId.\r\n"+
        "?measure rdf:type epa:WaterMeasurement .\r\n"+
        "?measure epa:hasUSGSSiteId ?siteId.\r\n"+
        "?measure epa:hasElement ?element .\r\n"+
        "}}";

	//alert(sparqlUSGSElements);
 
       $.ajax({type: "GET",
          url: thisserviceagent,
          data: "query="+encodeURIComponent(sparqlUSGSElements),
          dataType: "xml", 
          success: processElementDataPerCounty,
         error: function (jqXHR, textStatus, errorThrown){
					alert(jqXHR.status+", "+textStatus+", "+ errorThrown);
         }
     });
} 

function requestEPAElementsPerCounty(stateAbbr, countyCode){
	//alert("In requestUSGSElementsPerCounty");
	var paddedCountyCode=stateAbbr+PadNumber(countyCode, 3);
	var thisserviceagent="http://localhost/demoWater/trendData.php";
var sparqlEPAElements = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\r\n"+
        "PREFIX epa: <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#>\r\n"+
        "\r\n"+
        "SELECT DISTINCT ?element\r\n"+
        "WHERE {\r\n"+
        //"graph <http://tw2.tw.rpi.edu/water/RI/EPA>\r\n"+
        "graph <http://tw2.tw.rpi.edu/water/"+stateAbbr+"/EPA>\r\n"+
        "{\r\n"+
        "?fac rdf:type epa:Facility .\r\n"+
        //"?fac epa:hasStateCode "RI" .\r\n"+
        //"?fac epa:hasCountyCode "RI001" .\r\n"+
        "?fac epa:hasStateCode \"" + stateAbbr + "\" .\r\n"+
        "?fac epa:hasCountyCode \"" + paddedCountyCode + "\" .\r\n"+
        "?fac epa:hasPermit ?permit .\r\n"+
        "?measure rdf:type epa:FacilityMeasurement .\r\n"+
        "?measure epa:hasPermit ?permit .\r\n"+
        "?measure epa:hasElement ?element .\r\n"+
        "}}";

	//alert(sparqlEPAElements);
 
       $.ajax({type: "GET",
          url: thisserviceagent,
          data: "query="+encodeURIComponent(sparqlEPAElements),
          dataType: "xml", 
          success: processElementDataPerCounty,
         error: function (jqXHR, textStatus, errorThrown){
					alert(jqXHR.status+", "+textStatus+", "+ errorThrown);
         }
     });
} 

function processElementDataPerCounty(data) {
	//alert("In processElementDataPerCounty");
  //var element_select = document.getElementById("element_selection_canvas");
	//var elementSelectionId='contaminant_selection_canvas';
	//var element_select = document.getElementById(elementSelectionId);
	//element_select.innerHTML="";

	if(initTag===true)
		elementArr = [];
	
	$(data).find('result').each(function(){
	var elementUri="", elementName="";
	$(this).find("binding").each(function(){
	  if($(this).attr("name")=="element")
	  {
	    elementUri=($(this).find("uri").text());
			elementName=elementUri.substring(elementUri.indexOf("#")+1)
			//alert(elementName);
			elementArr.push(elementName);
	  }
	});
	});

	//alert(num_source);
	//alert(initTag);
	if(num_source==1) {
		elementArr.sort();
		populateSelectList(elementArr);
	}
	else {
		if(initTag===true)
			initTag=false;
		else //2nd time
		{
			elementArr.sort();
			populateSelectList(eliminateDuplicates(elementArr));
		}
	}


/*
	for (var i = 0; i < elementArr.length; i++) {
		append_selection_element(element_select, elementArr[i] , elementArr[i]);
	}

	if(element_select.innerHTML!="")
		element_select.selectedIndex = 0;
	else
		element_select.selectedIndex = -1;

*/
}

//from USGS
		function parseParent(fullPath /* string */){
			var parts = fullPath.split("/");
			parts[parts.length - 1] = "";
			return parts.join("/");
		}

		function openCodes(caller /*String*/, parent /*string*/, child /*string*/){
			var delim = ';';

			var parentInput = document.getElementById(parent);	//get a parentInput if there is one

			if (!parentInput || (parentInput.value && parentInput.value != '')) {

				//build url parameters string
				var urlParam = 'caller=' + caller;

				//if I change this value and it has a child, I want to delete its child values
				if (child) urlParam += '&childInput=' + child;

				//parent parameter's value(s)
				if (parentInput && parentInput.value != '') {
					 urlParam += '&parentValues=' + parentInput.value + '&parentType=' + parent;
				}
				
				//items have been selected will need to load in the popup as already selected
				urlParam += '&previousSelections=' + document.getElementById(caller).value

				openCodesPopup("item_select.html?" + urlParam, "selectWindow");
			} else {
				alert('Please select: ' + parent);
			}
			return false;
		}

		function openCodesPopup(URL, windowName){
			if (codesWindow) codesWindow.close();
            codesWindow = window.open(appBase + URL, windowName, "status=1,menubar=1,resizable=1,width=450,height=700,location=1,scrollbars=1");
            return false;
		}
//end of from USGS
//---------------------------------------------------------------------------------------
function testShow(){
//alert("In testShow");
buildWaterQuery();
}

function onchangeNoFilterForCharacteristic(){
 if(document.getElementById('NoFilterForCharacteristic').checked)
	noFilterForCharacteristicFlag=true;
 else
	noFilterForCharacteristicFlag=false;

	//alert("noFilterForCharacteristicFlag is: "+noFilterForCharacteristicFlag);
}

function getSelectedElements(){
	//Get selected elements from the page
	var selection = document.getElementById('characteristicName').value;
	//alert(selection.length);
	if(selection.length==0)
	{
		alert("Please select an element!");
		return undefined;
	}
	//var selectedElements = selection.split(delim);	
  return selection.split(delim);	
}


function buildPolltedWaterSiteQuery(){
	//alert("In buildWaterQuery");
	var selectedElements = getSelectedElements();
	if(selectedElements==undefined)
		return;

	//
	var sparqlBegin="prefix  rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix epa: <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#> prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> select * where{";
	//var sparqlBefore="{?s rdf:type epa:PollutedWaterSource. ?s geo:lat ?lat. ?s geo:long ?long. ?s epa:hasCountyCode \""+countyCode+"\". ?s epa:hasUSGSSiteId ?siteId.";
	var sparqlBefore="{?s rdf:type epa:PollutedWaterSource. ?s geo:lat ?lat. ?s geo:long ?long. ?s epa:hasCountyCode \""+countyCode+"\". ?s  epa:hasMeasurement ?measure . ?measure rdf:type epa:ExceededThreshold . ";
	for(var i=0; i<selectedElements.length; i++){
			sparqlPart = sparqlBefore+"?measure epa:hasElement <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#"+selectedElements[i]+"> .}"
		if(i==0)
			sparqlStat = sparqlPart; 
		else
			sparqlStat += " UNION " + sparqlPart;
	}
	sparqlStat+="}";

	//alert(sparqlBegin + sparqlStat);
	return sparqlBegin + sparqlStat;
}

function buildPollutingFacilityQuery(){
	//alert("In buildPollutingFacilityQuery");
	var selectedElements = getSelectedElements();
	if(selectedElements==undefined)
		return;
	//
	var sparqlBegin="prefix  rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix epa: <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#> prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> select * where{";
	var sparqlBefore="{?s rdf:type epa:ViolatingFacility. ?s geo:lat ?lat. ?s geo:long ?long. ?s  epa:hasMeasurement ?measure . ?measure rdf:type epa:Violation . ";
	for(var i=0; i<selectedElements.length; i++){
			sparqlPart = sparqlBefore+"?measure epa:hasElement <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#"+selectedElements[i]+">.}" //<http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#"+selectedElements[i]+">
		if(i==0)
			sparqlStat = sparqlPart; 
		else
			sparqlStat += " UNION " + sparqlPart;
	}
	sparqlStat+="}";

	//alert(sparqlBegin + sparqlStat);
	return sparqlBegin + sparqlStat;

//	var facilityquery="prefix  rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix epa: <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#> prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> select * where{?s rdf:type epa:ViolatingFacility. ?s geo:lat ?lat. ?s geo:long ?long.}";
}

function showAddress2(address,tstart,tlimit) {
  var element="http://tw2.tw.rpi.edu/owl/eap.owl#Arsenic";
  //document.getElementById("test2").innerHTML=element.replace("http://tw2.tw.rpi.edu/owl/eap.owl#","");
  var prevpage="";
  var nextpage="";
  start=tstart;
  limit=tlimit;
  document.getElementById("start").innerHTML=1;
  document.getElementById("limit").innerHTML=start+limit;
  
  if(document.getElementById("clear").checked){
  document.getElementById("start").innerHTML=start+1;
  map.clearOverlays();
  
  if(start > 0){
  var thisstart=start-limit;
  
  if(thisstart<0)
    thisstart=0;
	
  prevpage="<a href=\"javascript:showAddress('"+address+"',"+thisstart+","+limit+")\">Preivous "+limit+" triples</a>";
  }
  }
  
  nextpage="<a href=\"javascript:showAddress('"+address+"',"+(start+limit)+","+limit+")\">next "+limit+" triples</a>";
  
  document.getElementById("page").innerHTML=prevpage+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+nextpage;
  var waterquery="";
  var facilityquery="";
  if (geocoder) {
    geocoder.getLatLng(
      address,
      function(point) {
	if (!point) {
	  alert(address + " not found");
	} else {
	  map.setCenter(point, 10);
	}
      }
    );
	
   $.ajax({type: "GET",
          url: thiszipagent, // SPARQL service URI
          data:"code="+address, // query parameter
          dataType: "json",	  
          success: function(data){
		  //document.getElementById("test").innerHTML=data.result.stateAbbr+" "+data.result.stateCode+" "+data.result.countyCode;
		  state=data.result.stateAbbr;
		  var stateCode=data.result.stateCode;
		  stateCode=stateCode.split(":")[1];
		  countyCode=data.result.countyCode;
		  countyCode=countyCode.split(":")[2];
		  countyCode=countyCode.replace(/^0+/,"");

		  //waterquery="prefix  rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix epa: <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#> prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> select * where{?s rdf:type epa:PollutedWaterSource. ?s geo:lat ?lat. ?s geo:long ?long. ?s epa:hasCountyCode \""+countyCode+"\".}";
			//waterquery=buildPolltedWaterSiteQuery();
			var waterquery="";
			if(noFilterForCharacteristicFlag)
				waterquery="prefix  rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix epa: <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#> prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> select * where{?s rdf:type epa:PollutedWaterSource. ?s geo:lat ?lat. ?s geo:long ?long. ?s epa:hasCountyCode \""+countyCode+"\".}";
			else
				waterquery=buildPolltedWaterSiteQuery();

		  showPollutedWater2(waterquery);		  
		  }
	 });
	 
	 
  }
}

function showPollutedWater2(query)
{
  var success = function(data) {
    pollutedwatersource = new Array();
    $(data).find('result').each(function(){
      var lat="",lng="",sub="",label="";
      $(this).find("binding").each(function(){
	 
        if($(this).attr("name")=="lat")
        {
          lat=($(this).find("literal").text());
        }
        if($(this).attr("name")=="long")
        {
          lng=($(this).find("literal").text());
        }
        if($(this).attr("name")=="label")
        {
          label=($(this).find("literal").text());
        }
        if($(this).attr("name")=="s")
        {
          sub=($(this).find("uri").text());		 
          pollutedwatersource.push(sub);
        }
      });
      if(lat!=""&&lng!=""){
	  //document.getElementById("test").innerHTML="ready to display";
        var site={'uri':sub,'label':label,'isPolluted':true};
        var blueIcon = new GIcon(G_DEFAULT_ICON,"image/pollutedwater.png");
        blueIcon.iconSize = new GSize(29,34);
        var latlng = new GLatLng(lat ,lng);
        markerOptions = { icon:blueIcon };
        var marker=new GMarker(latlng, markerOptions);
        GEvent.addListener(marker, "click",
            		   function() {
            		     var info = queryForWaterPollution(site,false,marker);
            		     marker.openInfoWindow(info);
            	 	   }
            		  );
        map.addOverlay(marker);
		wqpMarkers["pollutedWater"].push(marker);
      }
    });
    showCleanWater2();
  };

  var source=null;
  if(data_source["USGS"]==1)
    source="USGS";
  var parameter="data=water&state="+state+"&countyCode="+countyCode+"&query="+encodeURIComponent(query)+"&start="+start+"&limit="+limit+"&source="+source;
  if(regulation!=""){
  parameter+="&regulation="+regulation;
  }
  
  $.ajax({type: "GET",
          url: thisserviceagent, // SPARQL service URI
          data: parameter,//"state="+state+"&countyCode="+countyCode+"&query="+encodeURIComponent(query), // query parameter
          dataType: "xml",	  
          success: success
	 });
}


function showCleanWater2()
{
  var success = function(data) {

    $(data).find('result').each(function(){
      var lat="",lng="",sub="",label="";var show=true;
      $(this).find("binding").each(function(){

	if($(this).attr("name")=="s")
	{
      //document.getElementById("test").innerHTML+=pollutedwatersource.length;   
	  for(var i=0;i<pollutedwatersource.length;i++)
	  {
	     //document.getElementById("test").innerHTML+=pollutedwatersource[i]+" ";   
	    if($(this).find("uri").text()==pollutedwatersource[i]){
	      show=false;
		  break;
	    }
	  }
	  sub=$(this).find("uri").text();
	}
	if($(this).attr("name")=="lat")
	{
	  lat=($(this).find("literal").text());
	  //document.getElementById("test").innerHTML+=lat;
	}
	if($(this).attr("name")=="long")
	{
	  lng=($(this).find("literal").text());
	  //document.getElementById("test").innerHTML+=lng;
	}
	if($(this).attr("name")=="label")
	{
	  label=($(this).find("literal").text());
	  //document.getElementById("test").innerHTML+=label;
	}
      });			
      if(lat!=""&&lng!=""&&show){
		  
	var thisIcon = new GIcon(G_DEFAULT_ICON,"image/cleanwater2.png");
	thisIcon.iconSize = new GSize(30,34);
	var latlng = new GLatLng(lat ,lng);
	markerOptions = { icon:thisIcon };

	var site={'uri':sub,'label':label,'isPolluted':false};
	var marker=new GMarker(latlng, markerOptions);
	GEvent.addListener(marker, "click",
			   function() {
			     var info=queryForWaterPollution(site,false,marker);
			     marker.openInfoWindowHtml(info);
			   }
			  );
	map.addOverlay(marker);
    wqpMarkers["cleanWater"].push(marker);	
      };
    });
	//var facilityquery="prefix  rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix epa: <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#> prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> select * where{?s rdf:type epa:ViolatingFacility. ?s geo:lat ?lat. ?s geo:long ?long.}";
	var facilityquery="";
  if(noFilterForCharacteristicFlag)
		facilityquery="prefix  rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix epa: <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#> prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> select * where{?s rdf:type epa:ViolatingFacility. ?s geo:lat ?lat. ?s geo:long ?long.}";
	else
		facilityquery=buildPollutingFacilityQuery();

	showViolatedFacility(facilityquery);
  };
  var query="prefix  rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix this: <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#> prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> select * where{?s rdf:type <http://sweet.jpl.nasa.gov/2.1/realmHydroBody.owl#BodyOfWater>. ?s geo:lat ?lat. ?s geo:long ?long. }"
  var source=null;
  if(data_source["USGS"]==1)
    source="USGS";
  var parameter="data=water&state="+state+"&countyCode="+countyCode+"&query="+encodeURIComponent(query)+"&start="+start+"&limit="+limit+"&source="+source;
  if(regulation!=""){
  parameter+="&regulation="+regulation;
  }
  $.ajax({type: "GET",
	  url: thisserviceagent, // SPARQL service URI
	  data: parameter,//"state="+state+"&countyCode="+countyCode+"&query=" + encodeURIComponent(), // query parameter
      dataType: "xml",
      success: success
	 });
}



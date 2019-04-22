var MATLAB_VERSION = {
  "Matlab R2006a" : "7.2",
  "Matlab R2006b" : "7.3",
  "Matlab R2007a" : "7.4",
  "Matlab R2007b" : "7.5",
  "Matlab R2008a" : "7.6",
  "Matlab R2008b" : "7.7",
  "Matlab R2009a" : "7.8",
  "Matlab R2009b" : "7.9",
  "Matlab R2010a" : "7.10",
  "Matlab R2010b" : "7.11",
  "Matlab R2011a" : "7.12",
  "Matlab R2011b" : "7.13",
  "Matlab R2012a" : "7.14",
  "Matlab R2012b" : "8.0",
  "Matlab R2013a" : "8.1",
  "Matlab R2013b" : "8.2",
  "Matlab R2014a" : "8.3",
  "Matlab R2014b" : "8.4",
  "Matlab R2015a" : "8.5",
  "Matlab R2015b" : "8.6",
  "Matlab R2016a" : "9.0",
  "Matlab R2016b" : "9.1",
  "Matlab R2017a" : "9.2",
  "Matlab R2017b" : "9.3",
  "Matlab R2018a" : "9.4",
  "Matlab R2018b" : "9.5",
  "Matlab R2019a" : "9.6"
}

var choice = "Matlab R2018b";

(function($){
  $(function(){
    $('.sidenav').sidenav();

    $('select').formSelect();

    $("#target").on('change', function() {
      choice = $(this).val();
    });

    $("#fileinput").on('change', function(evt) {
    });

  });
})(jQuery);


function edit_coreProperties(data, version) {
  xml = $(data);
  xml.find("cp:version").text(version.replace("Matlab ", ""));
}

function edit_mwcoreProperties(data, version) {
  xml = $(data);
  xml.find("matlabRelease").text(version.replace("Matlab ", ""));
}

function edit_mwcorePropertiesExtension(data, version) {
  xml = $(data);
  xml.find("matlabVersion").text(MATLAB_VERSION[version]);
}

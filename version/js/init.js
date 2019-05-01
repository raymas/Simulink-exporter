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

    $("#fileinput").on('change', function(event) {
      // Loading
      $('#progressbar').css('visibility', 'visible');
      //Reading file
      readSingleFile(event);
    });

  });
})(jQuery);

class MDL {
  constructor(name, buffer, target) {
    this.name = name;
    this.buffer = buffer.split("\n");
    this.target = target;
    this.changeVersion();
  }

  getName() {
    return this.name;
  }

  getBuffer() {
    return this.buffer.join("\n");
  }

  changeVersion() {
    for (var i=0; i < this.buffer.length; i++) {
      var line = this.buffer[i];
      if (line.includes("Version")) {
        // First one is reach, correcting
        this.buffer[i] = line.replace(new RegExp("[0-9][.][0-9]", "g"), this.target);
        // only the first one is the one we need
        break;
      }
    }
  }

  parseInformation() {

  }

}

class SLX {
  constructor(name, buffer, target) {
    this.name = name;
    this.buffer = buffer;
    this.target = target;
  }

  edit_coreProperties(data, version) {
    xml = $(data);
    xml.find("cp:version").text(version.replace("Matlab ", ""));
  }

  edit_mwcoreProperties(data, version) {
    xml = $(data);
    xml.find("matlabRelease").text(version.replace("Matlab ", ""));
  }

  edit_mwcorePropertiesExtension(data, version) {
    xml = $(data);
    xml.find("matlabVersion").text(MATLAB_VERSION[version]);
  }

}


function readSingleFile(e) {
  var file = e.target.files[0];
  console.log(file);
  if (!file) {
    return;
  }
  var ext = file.name.split('.'); ext = ext[ext.length - 1];
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    console.log(e.target.result);
    if (ext == "mdl" && contents != "") {
      var mdl = new MDL(file, contents, MATLAB_VERSION[choice]);
      pushToDownload(mdl.getBuffer(), new String("[" + choice.split(' ')[1] + "]" + file.name));
      $('#progressbar').css('visibility', 'hidden');
    } else if (ext == "slx" && contents != "") {
      var slx = new SLX(file, contents, MATLAB_VERSION[choice]);
    } else {
      M.toast({html: 'Serioulsy ? An ' + ext + ' file ?'});
    }
  };
  reader.readAsText(file);
}


function pushToDownload(payload, filename) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(payload));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

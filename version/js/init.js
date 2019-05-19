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
      $('#progressbar').show();
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
  constructor(file, zip, target) {
    this.name = file.name;
    this.zip = zip;
    this.target = target;
    this.fileStreams = ["metadata/coreProperties.xml", "metadata/mwcoreProperties.xml", "metadata/mwcorePropertiesExtension.xml"]
    this.changeVersion();
  }

  changeVersion() {
    this.zip.forEach((relativePath, zipEntry) => {
      for (var i in this.fileStreams) {
        var path = this.fileStreams[i];
        if (path.localeCompare(relativePath) == 0) {
          var callname = "this.edit_" + ((relativePath.split("/")[1]).split("."))[0];
          // wow! an eval ?
          this.zip.file(relativePath).async("string").then((data) => {
            var returnedData = eval(callname + "(data, this.target)");
            console.log(returnedData);
            //TODO: this is not working
            this.zip.file(relativePath, returnedData);
          });
        }
      }
    });
    //TODO: uncomment this
    /*
    this.zip.generateAsync({type:"base64"}).then((base64) => {
      pushToDownload(base64, new String("[" + choice.split(' ')[1] + "]" + this.name), 'data:application/zip;base64,');
    });
    */
  }

  edit_coreProperties(data, version) {
    var xml = this.xmlParser(data);
    xml.getElementsByTagName("cp:version")[0].childNodes[0].nodeValue = version.split(" ")[1];
    return new XMLSerializer().serializeToString(xml.documentElement);
  }

  edit_mwcoreProperties(data, version) {
    var xml = this.xmlParser(data);
    xml.getElementsByTagName("matlabRelease")[0].childNodes[0].nodeValue = version.split(" ")[1];
    return new XMLSerializer().serializeToString(xml.documentElement);
  }

  edit_mwcorePropertiesExtension(data, version) {
    var xml = this.xmlParser(data);
    xml.getElementsByTagName("matlabVersion")[0].childNodes[0].nodeValue = MATLAB_VERSION[version];
    return new XMLSerializer().serializeToString(xml.documentElement);
  }

  xmlParser(data) {
    if (window.DOMParser) {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(data, "text/xml");
    } else {
      var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = false;
      xmlDoc.loadXML(data);
    }
    return xmlDoc;
  }
}


function readSingleFile(e) {
  var file = e.target.files[0];
  
  if (!file) {
    return;
  }

  var ext = file.name.split('.'); ext = ext[ext.length - 1];
  
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
  
    if (ext == "mdl" && contents != "") {
      var mdl = new MDL(file, contents, MATLAB_VERSION[choice]);
      pushToDownload(mdl.getBuffer(), new String("[" + choice.split(' ')[1] + "]" + file.name, 'data:text/plain;charset=utf-8,'));
      $('#progressbar').hide();
    } else if (ext == "slx" && contents !== null) {
      JSZip.loadAsync(contents).then(function(zip) {
        new SLX(file, zip, choice);
      });
    } else {
      M.toast({html: 'Serioulsy ? An ' + ext + ' file ?'});
    }
  };
  if (ext == 'slx') {
    reader.readAsArrayBuffer(file);
  } else if (ext == 'mdl') {
    reader.readAsText(file);
  }
}


function pushToDownload(payload, filename, type) {
  var element = document.createElement('a');
  element.setAttribute('href', type + encodeURIComponent(payload));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

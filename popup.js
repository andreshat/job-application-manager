document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const cv = document.getElementById('cv').files[0];
    const transcripts = document.getElementById('transcripts').files[0];
    const workPermit = document.getElementById('workPermit').files[0];
  
    const reader = new FileReader();
    reader.onload = function() {
      const cvData = reader.result;
      chrome.storage.local.set({cv: cvData}, function() {
        alert('CV uploaded successfully!');
      });
    };
    if (cv) reader.readAsDataURL(cv);
    
    const reader2 = new FileReader();
    reader2.onload = function() {
      const transcriptsData = reader2.result;
      chrome.storage.local.set({transcripts: transcriptsData}, function() {
        alert('Transcripts uploaded successfully!');
      });
    };
    if (transcripts) reader2.readAsDataURL(transcripts);
    
    const reader3 = new FileReader();
    reader3.onload = function() {
      const workPermitData = reader3.result;
      chrome.storage.local.set({workPermit: workPermitData}, function() {
        alert('Work Permit uploaded successfully!');
      });
    };
    if (workPermit) reader3.readAsDataURL(workPermit);
  });

document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['cv', 'transcripts', 'workPermit'], function(items) {
      if (items.cv) {
        console.log('CV:', items.cv);
      }
      if (items.transcripts) {
        console.log('Transcripts:', items.transcripts);
      }
      if (items.workPermit) {
        console.log('Work Permit:', items.workPermit);
      }
    });
  });
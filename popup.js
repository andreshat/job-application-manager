document.addEventListener('DOMContentLoaded', function() {
    const uploadView = document.getElementById('uploadView');
    const viewFiles = document.getElementById('viewFiles');
    const switchToView = document.getElementById('switchToView');
    const switchToUpload = document.getElementById('switchToUpload');
    const fileList = document.getElementById('fileList');
  
    // Update file name display
    document.getElementById('cv').addEventListener('change', function() {
      const fileName = this.files[0] ? this.files[0].name : '[Choose file]';
      document.getElementById('cvFileName').textContent = fileName;
    });
  
    document.getElementById('transcripts').addEventListener('change', function() {
      const fileName = this.files[0] ? this.files[0].name : '[Choose file]';
      document.getElementById('transcriptsFileName').textContent = fileName;
    });
  
    document.getElementById('workPermit').addEventListener('change', function() {
      const fileName = this.files[0] ? this.files[0].name : '[Choose file]';
      document.getElementById('workPermitFileName').textContent = fileName;
    });
  
    // Switch to view uploaded files
    switchToView.addEventListener('click', function() {
      populateFileList();
      uploadView.classList.add('hidden');
      viewFiles.classList.remove('hidden');
    });
  
    // Switch back to upload form
    switchToUpload.addEventListener('click', function() {
      viewFiles.classList.add('hidden');
      uploadView.classList.remove('hidden');
    });
  
    // Handle file upload
    document.getElementById('uploadForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const cv = document.getElementById('cv').files[0];
      const transcripts = document.getElementById('transcripts').files[0];
      const workPermit = document.getElementById('workPermit').files[0];
  
      if (cv) {
        const reader = new FileReader();
        reader.onload = function() {
          const cvData = reader.result;
          chrome.storage.local.set({ cv: cvData }, function() {
            console.log('CV uploaded and stored successfully!');
          });
        };
        reader.readAsDataURL(cv);
      }
  
      if (transcripts) {
        const reader2 = new FileReader();
        reader2.onload = function() {
          const transcriptsData = reader2.result;
          chrome.storage.local.set({ transcripts: transcriptsData }, function() {
            console.log('Transcripts uploaded and stored successfully!');
          });
        };
        reader2.readAsDataURL(transcripts);
      }
  
      if (workPermit) {
        const reader3 = new FileReader();
        reader3.onload = function() {
          const workPermitData = reader3.result;
          chrome.storage.local.set({ workPermit: workPermitData }, function() {
            console.log('Work Permit uploaded and stored successfully!');
          });
        };
        reader3.readAsDataURL(workPermit);
      }
    });
  
    // Populate the file list with stored files
    function populateFileList() {
      chrome.storage.local.get(['cv', 'transcripts', 'workPermit'], function(items) {
        fileList.innerHTML = ''; // Clear the existing list
        if (items.cv) {
          const cvLink = document.createElement('a');
          cvLink.href = items.cv;
          cvLink.textContent = 'CV';
          cvLink.download = 'cv';
          fileList.appendChild(cvLink);
          fileList.appendChild(document.createElement('br'));
        }
  
        if (items.transcripts) {
          const transcriptsLink = document.createElement('a');
          transcriptsLink.href = items.transcripts;
          transcriptsLink.textContent = 'Transcripts';
          transcriptsLink.download = 'transcripts';
          fileList.appendChild(transcriptsLink);
          fileList.appendChild(document.createElement('br'));
        }
  
        if (items.workPermit) {
          const workPermitLink = document.createElement('a');
          workPermitLink.href = items.workPermit;
          workPermitLink.textContent = 'Work Permit';
          workPermitLink.download = 'workPermit';
          fileList.appendChild(workPermitLink);
          fileList.appendChild(document.createElement('br'));
        }
      });
    }
  });
  
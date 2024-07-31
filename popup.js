document.addEventListener('DOMContentLoaded', function() {
    const uploadView = document.getElementById('uploadView');
    const viewFiles = document.getElementById('viewFiles');
    const switchToView = document.getElementById('switchToView');
    const switchToUpload = document.getElementById('switchToUpload');
    const fileList = document.getElementById('fileList');
    const noFilesMessage = document.getElementById('noFilesMessage');
    const cvInput = document.getElementById('cv');
    const transcriptsInput = document.getElementById('transcripts');
    const workPermitInput = document.getElementById('workPermit');
    const cvFileName = document.getElementById('cvFileName');
    const transcriptsFileName = document.getElementById('transcriptsFileName');
    const workPermitFileName = document.getElementById('workPermitFileName');
  
    // Display uploaded files by default
    populateFileList();
    prefillForm();
  
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
  
    // Update file name display on file selection
    cvInput.addEventListener('change', function() {
      cvFileName.textContent = this.files[0] ? this.files[0].name : '[Choose file]';
    });
  
    transcriptsInput.addEventListener('change', function() {
      transcriptsFileName.textContent = this.files[0] ? this.files[0].name : '[Choose file]';
    });
  
    workPermitInput.addEventListener('change', function() {
      workPermitFileName.textContent = this.files[0] ? this.files[0].name : '[Choose file]';
    });
  
    // Handle file upload
    document.getElementById('uploadForm').addEventListener('submit', function(e) {
      e.preventDefault();
  
      const cv = cvInput.files[0];
      const transcripts = transcriptsInput.files[0];
      const workPermit = workPermitInput.files[0];
  
      if (cv) {
        const reader = new FileReader();
        reader.onload = function() {
          const cvData = reader.result;
          const cvFileName = cv.name;
          const cvUploadDate = new Date().toLocaleString();
          chrome.storage.local.set({ cv: { data: cvData, name: cvFileName, date: cvUploadDate } }, function() {
            console.log('CV uploaded and stored successfully!');
          });
        };
        reader.readAsDataURL(cv);
      }
  
      if (transcripts) {
        const reader2 = new FileReader();
        reader2.onload = function() {
          const transcriptsData = reader2.result;
          const transcriptsFileName = transcripts.name;
          const transcriptsUploadDate = new Date().toLocaleString();
          chrome.storage.local.set({ transcripts: { data: transcriptsData, name: transcriptsFileName, date: transcriptsUploadDate } }, function() {
            console.log('Transcripts uploaded and stored successfully!');
          });
        };
        reader2.readAsDataURL(transcripts);
      }
  
      if (workPermit) {
        const reader3 = new FileReader();
        reader3.onload = function() {
          const workPermitData = reader3.result;
          const workPermitFileName = workPermit.name;
          const workPermitUploadDate = new Date().toLocaleString();
          chrome.storage.local.set({ workPermit: { data: workPermitData, name: workPermitFileName, date: workPermitUploadDate } }, function() {
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
        let hasFiles = false;
  
        if (items.cv) {
          createFileLink(items.cv, 'CV');
          hasFiles = true;
        }
  
        if (items.transcripts) {
          createFileLink(items.transcripts, 'Transcripts');
          hasFiles = true;
        }
  
        if (items.workPermit) {
          createFileLink(items.workPermit, 'Work Permit');
          hasFiles = true;
        }
  
        if (!hasFiles) {
          noFilesMessage.textContent = 'No files uploaded. Please upload all the necessary files.';
        } else {
          noFilesMessage.textContent = '';
        }
      });
    }
  
    // Create a file link
    function createFileLink(fileItem, displayName) {
      const blob = dataURLToBlob(fileItem.data);
      const blobUrl = URL.createObjectURL(blob);
  
      const fileLink = document.createElement('a');
      fileLink.href = blobUrl;
      fileLink.textContent = displayName;
      fileLink.title = fileItem.name;
      fileLink.target = '_blank';
      fileLink.classList.add('d-block');
      fileLink.innerHTML += ` <span class="file-info">(latest update: ${fileItem.date})</span>`;
      
      fileLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.open(blobUrl, '_blank');
      });
  
      fileList.appendChild(fileLink);
    }
  
    // Convert a data URL to a Blob
    function dataURLToBlob(dataURL) {
      const byteString = atob(dataURL.split(',')[1]);
      const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    }
  
    // Pre-fill the form based on previously uploaded files
    function prefillForm() {
      chrome.storage.local.get(['cv', 'transcripts', 'workPermit'], function(items) {
        if (items.cv) {
          cvFileName.textContent = items.cv.name;
          cvInput.removeAttribute('required');
        }
        if (items.transcripts) {
          transcriptsFileName.textContent = items.transcripts.name;
        }
        if (items.workPermit) {
          workPermitFileName.textContent = items.workPermit.name;
        }
      });
    }
  });
  
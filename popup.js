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
          const cvLink = document.createElement('a');
          cvLink.href = items.cv.data;
          cvLink.textContent = 'CV';
          cvLink.download = 'cv';
          cvLink.title = items.cv.name;
          cvLink.target = '_blank';
          cvLink.classList.add('d-block');
          cvLink.innerHTML += ` <span class="file-info">(latest update: ${items.cv.date})</span>`;
          fileList.appendChild(cvLink);
          hasFiles = true;
        }
  
        if (items.transcripts) {
          const transcriptsLink = document.createElement('a');
          transcriptsLink.href = items.transcripts.data;
          transcriptsLink.textContent = 'Transcripts';
          transcriptsLink.download = 'transcripts';
          transcriptsLink.title = items.transcripts.name;
          transcriptsLink.target = '_blank';
          transcriptsLink.classList.add('d-block');
          transcriptsLink.innerHTML += ` <span class="file-info">(latest update: ${items.transcripts.date})</span>`;
          fileList.appendChild(transcriptsLink);
          hasFiles = true;
        }
  
        if (items.workPermit) {
          const workPermitLink = document.createElement('a');
          workPermitLink.href = items.workPermit.data;
          workPermitLink.textContent = 'Work Permit';
          workPermitLink.download = 'workPermit';
          workPermitLink.title = items.workPermit.name;
          workPermitLink.target = '_blank';
          workPermitLink.classList.add('d-block');
          workPermitLink.innerHTML += ` <span class="file-info">(latest update: ${items.workPermit.date})</span>`;
          fileList.appendChild(workPermitLink);
          hasFiles = true;
        }
  
        if (!hasFiles) {
          noFilesMessage.textContent = 'No files uploaded. Please upload all the necessary files.';
        } else {
          noFilesMessage.textContent = '';
        }
      });
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
  
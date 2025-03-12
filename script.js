document.addEventListener('DOMContentLoaded', function() {
    // Quiz data
    const quizData = [
      {
        id: 1,
        title: "Basic Identification",
        subtitle: "So We Know Who to Blame Later",
        questions: [
          {
            id: "name",
            label: "What's your name?",
            description: "Yes, your actual name. No aliases... for now.",
            type: "input"
          },
          {
            id: "regNumber",
            label: "What's your registration number?",
            description: "This isn't a government background check, we swear.",
            type: "input"
          }
        ]
      },
      {
        id: 2,
        title: "Choose Your Path",
        subtitle: "A.K.A. Pick Your Poison (Select up to 2 domains)",
        questions: [
          {
            id: "domain",
            label: "Which domain do you want to sell your soul—uh, we mean, contribute to?",
            type: "checkbox",  // Changed from 'radio' to 'checkbox'
            maxSelect: 2,     // New property to limit selections
            options: [
              { value: "management", label: "Management (You enjoy herding cats and handling chaos?)" },
              { value: "electrical", label: "Electrical (You have a shocking interest in circuits?)" },
              { value: "mechanical", label: "Mechanical (You think hammers and duct tape fix everything?)" },
              { value: "software", label: "Software (You already have a broken sleep schedule, don't you?)" },
              { value: "design", label: "Design & Media (You believe aesthetics and social clout matter more than functionality?)" }
            ]
          }
        ]
      },
      {
        id: 3,
        title: "How Did You Stumble Upon Team VAUV?",
        questions: [
          {
            id: "discovery",
            type: "radio",
            options: [
              { value: "expo", label: "Saw it at the expo, thought it looked interesting." },
              { value: "friend", label: "A friend told me it's a cool team. I trust them..." },
              { value: "instagram", label: "Instagram sucked me in. The algorithm won this time." },
              { value: "form", label: "I never knew this existed until I saw the form. Now I'm here, questioning my life choices." },
              { value: "preferences", label: "Had to fill my preferences, so here I am—lost, but hopeful." }
            ]
          }
        ]
      },
      {
        id: 4,
        title: "How Would You Like to Prove Your Worth?",
        subtitle: "Choose wisely. Your reputation depends on it.",
        questions: [
          {
            id: "provingMethod",
            type: "radio",
            options: [
              { value: "test", label: "Take a test. (Will let you know the date and time soon. No, you can't Google the answers.)" },
              // { value: "task", label: "Do a task. (Ah, a true warrior. Respect.)" },
              { value: "easy_task", label: "Do a task. Easy mode: A warm-up to see if you can handle the heat." },
              { value: "hard_task", label: "Do a task. Hard mode: A test of willpower. Will you regret it? Maybe. Will we respect you? Definitely." }
            ]
          }
        ]
      },
      {
        id: 5,
        title: "Submission Complete",
        subtitle: "Your fate is sealed",
        content: "Remember, it's not about whether you finish the task—it's about proving you have the persistence, the drive, and just the right amount of insanity to thrive in Team VAUV.",
        final: true
      }
    ];
    
    // DOM elements
    const quizSections = document.getElementById('quiz-sections');
    const currentStepEl = document.getElementById('current-step');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progressFill = document.getElementById('progress-fill');
    const progressSteps = document.getElementById('progress-steps');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // State variables
    let currentStep = 0;
    let answers = {};
    
    // Initialize quiz
    function initQuiz() {
      renderQuizSection(currentStep);
      updateProgress();
      createProgressSteps();
    }
    
    // Render current quiz section
    function renderQuizSection(stepIndex) {
      const section = quizData[stepIndex];
      
      if (!section) return;
      
      quizSections.innerHTML = '';
      
      if (section.final) {
        // Final success screen
        quizSections.innerHTML = `
          <div class="final-section">
            <svg class="award-icon" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
            <p class="final-message">${section.content}</p>
            <p class="success-message">Your application has been submitted!</p>

            <div class="whatsapp-section">
              <h2>Join Our WhatsApp Group</h2>
              <img src="assets/qr.png" alt="WhatsApp Group QR Code" class="whatsapp-qr" />
              <p>Scan the QR code or <a href="YOUR_WHATSAPP_LINK" target="_blank" rel="noopener noreferrer">click here</a> to join the group</p>
            </div>
          </div>
        `;
        nextBtn.classList.add('hidden');
        submitBtn.classList.add('hidden');
        return;
      }
      
      const sectionEl = document.createElement('div');
      sectionEl.classList.add('section');
      
      // Add section title
      const titleEl = document.createElement('h2');
      titleEl.classList.add('section-title');
      titleEl.textContent = section.title;
      sectionEl.appendChild(titleEl);
      
      // Add section subtitle if exists
      if (section.subtitle) {
        const subtitleEl = document.createElement('p');
        subtitleEl.classList.add('section-subtitle');
        subtitleEl.textContent = section.subtitle;
        sectionEl.appendChild(subtitleEl);
      }
      
      // Add questions
      if (section.questions) {
        section.questions.forEach(question => {
          const questionGroup = document.createElement('div');
          questionGroup.classList.add('question-group');
          
          const questionLabel = document.createElement('label');
          questionLabel.classList.add('question-label');
          questionLabel.textContent = question.label || '';
          questionGroup.appendChild(questionLabel);
          
          if (question.description) {
            const descriptionEl = document.createElement('p');
            descriptionEl.classList.add('question-description');
            descriptionEl.textContent = question.description;
            questionGroup.appendChild(descriptionEl);
          }
          
          if (question.type === 'input') {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = question.id;
            input.name = question.id;
            input.classList.add('input-field');
            input.value = answers[question.id] || '';
            input.addEventListener('input', (e) => {
              answers[question.id] = e.target.value;
            });
            questionGroup.appendChild(input);
           } else if (question.type === 'checkbox' && question.options) {
            const checkboxGroup = document.createElement('div');
            checkboxGroup.classList.add('checkbox-group');
            
            // Initialize answers array if it doesn't exist
            if (!answers[question.id]) {
                answers[question.id] = [];
            }
            
            question.options.forEach(option => {
                const checkboxOption = document.createElement('label');
                checkboxOption.classList.add('checkbox-option');
                
                const checkboxInput = document.createElement('input');
                checkboxInput.type = 'checkbox';
                checkboxInput.id = `${question.id}-${option.value}`;
                checkboxInput.name = question.id;
                checkboxInput.value = option.value;
                checkboxInput.checked = answers[question.id].includes(option.value);
                
                // Handle checkbox change
                checkboxInput.addEventListener('change', () => {
                    if (checkboxInput.checked) {
                        // If trying to select more than maxSelect, prevent it
                        if (answers[question.id].length >= question.maxSelect) {
                            checkboxInput.checked = false;
                            alert(`You can only select up to ${question.maxSelect} domains`);
                            return;
                        }
                        answers[question.id].push(option.value);
                    } else {
                        answers[question.id] = answers[question.id].filter(value => value !== option.value);
                    }
                });
                
                const checkboxLabel = document.createTextNode(option.label);
                
                checkboxOption.appendChild(checkboxInput);
                checkboxOption.appendChild(checkboxLabel);
                checkboxGroup.appendChild(checkboxOption);
            });
            
            questionGroup.appendChild(checkboxGroup);
        }
          else if (question.type === 'radio' && question.options) {
            const radioGroup = document.createElement('div');
            radioGroup.classList.add('radio-group');
            
            question.options.forEach(option => {
              const radioOption = document.createElement('label');
              radioOption.classList.add('radio-option');
              
              const radioInput = document.createElement('input');
              radioInput.type = 'radio';
              radioInput.id = `${question.id}-${option.value}`;
              radioInput.name = question.id;
              radioInput.value = option.value;
              radioInput.checked = answers[question.id] === option.value;
              radioInput.addEventListener('change', () => {
                answers[question.id] = option.value;
              });
              
              const radioLabel = document.createTextNode(option.label);
              
              radioOption.appendChild(radioInput);
              radioOption.appendChild(radioLabel);
              radioGroup.appendChild(radioOption);
            });
            
            questionGroup.appendChild(radioGroup);
          }
          
          sectionEl.appendChild(questionGroup);
        });
      }
      
      quizSections.appendChild(sectionEl);
      
      // Update navigation buttons
      updateNavigationButtons();
    }
    
    // Update navigation buttons based on current step
    function updateNavigationButtons() {
      // Update prev button
      prevBtn.disabled = currentStep === 0;
      
      // Hide next button and show submit on the last question section
      if (currentStep === quizData.length - 2) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
      } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
      }
      
      // Update step indicator
      currentStepEl.textContent = currentStep + 1;
    }
    
    // Update progress bar
    function updateProgress() {
      const progress = (currentStep / (quizData.length - 1)) * 100;
      progressFill.style.width = `${progress}%`;
      
      // Update progress steps
      document.querySelectorAll('.progress-step').forEach((step, index) => {
        if (index < currentStep) {
          step.classList.add('completed');
          step.classList.remove('active');
        } else if (index === currentStep) {
          step.classList.add('active');
          step.classList.remove('completed');
        } else {
          step.classList.remove('active', 'completed');
        }
      });
    }
    
    // Create progress steps
    function createProgressSteps() {
      progressSteps.innerHTML = '';
      
      for (let i = 0; i < quizData.length - 1; i++) {
        const step = document.createElement('div');
        step.classList.add('progress-step');
        step.style.left = `${(i / (quizData.length - 2)) * 100}%`;
        
        if (i === currentStep) {
          step.classList.add('active');
        } else if (i < currentStep) {
          step.classList.add('completed');
        }
        
        progressSteps.appendChild(step);
      }
    }
    
    // Handle next button click
    nextBtn.addEventListener('click', () => {
      if (currentStep < quizData.length - 1) {
        currentStep++;
        renderQuizSection(currentStep);
        updateProgress();
      }
    });
    
    // Handle previous button click
    prevBtn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        renderQuizSection(currentStep);
        updateProgress();
      }
    });
    
    // Handle submit button click
    submitBtn.addEventListener('click', () => {
      // Validate required fields
      let canSubmit = true;
      
      // Check if all required fields are filled
      if (!answers.name || !answers.regNumber || !answers.domain || !answers.discovery || !answers.provingMethod) {
        alert('Please fill in all required fields');
        canSubmit = false;
      }
      
      // Check if at least one domain is selected
      if (!answers.domain || answers.domain.length === 0) {
        alert('Please select at least one domain');
        canSubmit = false;
      }

      if (canSubmit) {
        // Show loading overlay
        loadingOverlay.classList.remove('hidden');
        
        // Create a form that will be submitted in an iframe to avoid CORS issues
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        // Create a form element inside the iframe
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://script.google.com/macros/s/AKfycbxgAQ7IivpcGCYfzxspVYN7zg6DEoF51qRr3Zxh08MC0ELm5Ea7Vz_Wvd76Sg30db6O/exec';
        
        // Add each field to the form
        for (const key in answers) {
          if (answers.hasOwnProperty(key)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = answers[key] || '';
            form.appendChild(input);
          }
        }
        
        // Set up a timeout to handle cases where the iframe doesn't load
        const timeoutID = setTimeout(() => {
          loadingOverlay.classList.add('hidden');
          
          // Show error message but still advance to final screen
          currentStep++;
          renderQuizSection(currentStep);
          updateProgress();
          
          const errorMessage = document.createElement('div');
          errorMessage.classList.add('submission-error');
          errorMessage.innerHTML = `
            <svg class="error-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>There was an error submitting your application. Please try again later.</span>
          `;
          document.querySelector('.final-section')?.appendChild(errorMessage);
        }, 5000); // 5 seconds timeout
        
        // Add a load event to the iframe to handle completion
        iframe.onload = function() {
          clearTimeout(timeoutID);
          loadingOverlay.classList.add('hidden');
          
          // Show success screen
          currentStep++;
          renderQuizSection(currentStep);
          updateProgress();
          
          // Add success message
          const successMessage = document.createElement('div');
          successMessage.classList.add('submission-success');
          successMessage.innerHTML = `
            <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>Your application has been successfully submitted!</span>
          `;
          document.querySelector('.final-section')?.appendChild(successMessage);
          
          // Clean up iframe after submission
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 500);
        };
        
        // Add the form to the iframe and submit it
        iframe.contentDocument.body.appendChild(form);
        form.submit();
      }
    });
    
    // Initialize quiz on page load
    initQuiz();
  });
  

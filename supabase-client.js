const SUPABASE_URL = 'https://sfxoiqipxxlsbpwefkba.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rkOj390C1J2Doc1AdtVPmQ_MUyOkjt2';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function uploadDocumentFiles(files) {
    const uploaded = {};
    for (const [key, file] of Object.entries(files)) {
        if (!file) {
            uploaded[key] = null;
            continue;
        }
        const filePath = `admission-docs/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabaseClient.storage
            .from('admission-docs')
            .upload(filePath, file, { cacheControl: '3600', upsert: false });
        if (uploadError) throw uploadError;

        const { data: urlData, error: urlError } = supabaseClient.storage
            .from('admission-docs')
            .getPublicUrl(filePath);

        if (urlError) throw urlError;
        uploaded[key] = urlData.publicUrl;
    }
    return uploaded;
}

async function submitApplication(event) {
    event.preventDefault();
    const btn = document.getElementById('submitBtn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    }

    if (!document.getElementById('declaration')?.checked) {
        alert('Please accept the declaration.');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Application';
        }
        return;
    }

    const fieldMap = {
        fullName: 'fullName',
        fatherName: 'fatherName',
        motherName: 'motherName',
        dob: 'dob',
        gender: 'gender',
        nationality: 'nationality',
        category: 'category',
        religion: 'religion',
        aadhar: 'aadhar',
        phone: 'phone',
        email: 'email',
        address: 'address',
        schoolName: 'schoolName',
        board: 'board',
        sslcScore: 'sslcScore',
        passingYear: 'passingYear',
        sslcSubjects: 'sslcSubjects',
        course: 'course',
        secondLang: 'secondLang',
        extracurricular: 'extracurricular',
        fatherOccupation: 'fatherOccupation',
        motherOccupation: 'motherOccupation',
        income: 'income',
        medical: 'medical',
        emergencyPhone: 'emergencyPhone'
    };

    const data = {};
    for (const [key, id] of Object.entries(fieldMap)) {
        const el = document.getElementById(id);
        data[key] = el ? el.value.trim() : '';
    }

    try {
        const fileInputs = {
            marksCard: document.getElementById('marksCard')?.files[0],
            tcFile: document.getElementById('tcFile')?.files[0],
            photo: document.getElementById('photo')?.files[0],
            certificate: document.getElementById('certificate')?.files[0]
        };

        const fileUrls = await uploadDocumentFiles(fileInputs);
        data.documents = fileUrls;

        const { error } = await supabaseClient.from('admissions').insert([data]);
        if (error) {
            alert('Submit error: ' + error.message);
        } else {
            alert('Application submitted successfully.');
            document.getElementById('admissionForm')?.reset();
            document.querySelectorAll('input[type="file"]').forEach(input => input.value = '');
        }
    } catch (error) {
        alert('Error: ' + (error.message || 'Network error.'));
    }

    if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Application';
    }
}

window.submitApplication = submitApplication;
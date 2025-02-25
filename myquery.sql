CREATE TABLE mu_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_no VARCHAR(20) UNIQUE NOT NULL,
    roles JSON NOT NULL DEFAULT ('{"student": false'),
    pending_roles JSON NOT NULL DEFAULT ('[]'),
    otp varchar(255) NULL,
    otp_expiry_time TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,    
    slugs VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    author INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author) REFERENCES mu_users(id) ON DELETE CASCADE
);

CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    slugs VARCHAR(255) NOT NULL UNIQUE,
    author INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author) REFERENCES mu_users(id) ON DELETE CASCADE
);

CREATE TABLE blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category INT NOT NULL,
    tags JSON NOT NULL DEFAULT ('[]'),
    description TEXT,
    content TEXT NOT NULL,
    featuredImage VARCHAR(255) NOT NULL,
    author INT NOT NULL,
    reactions JSON NOT NULL DEFAULT ('{}'),
    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    visibility ENUM('public', 'private') NOT NULL DEFAULT 'public',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (author) REFERENCES mu_users(id) ON DELETE CASCADE
);

CREATE TABLE levels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    slugs VARCHAR(255) NOT NULL UNIQUE,
    author INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author) REFERENCES mu_users(id) ON DELETE CASCADE
);

CREATE TABLE faculty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    slugs VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    author INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author) REFERENCES mu_users(id) ON DELETE CASCADE
);

CREATE TABLE materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tags JSON NOT NULL DEFAULT ('[]'),
    image VARCHAR(255),
    file VARCHAR(255),
    author INT NOT NULL,
    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    visibility ENUM('public', 'private') NOT NULL DEFAULT 'public',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author) REFERENCES mu_users(id) ON DELETE CASCADE
);

CREATE TABLE scholarships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slugs VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    eligibilityCriteria JSON NOT NULL DEFAULT ('[]'), 
    amount DECIMAL(10,2) NOT NULL,
    applicationDeadline DATE NOT NULL,
    author INT NOT NULL,
    renewalCriteria JSON NOT NULL DEFAULT ('[]'), 
    contactInfo TEXT NOT NULL, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author) REFERENCES mu_users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slugs VARCHAR(255) UNIQUE,
  code VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  credits INT NOT NULL,
  duration INT NOT NULL,
  syllabus JSON,  
  authorId INT NOT NULL,
  facultyId INT NOT NULL,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (authorId) REFERENCES mu_users(id) ON DELETE CASCADE, 
  FOREIGN KEY (facultyId) REFERENCES faculty(id) ON DELETE CASCADE
);

CREATE TABLE university (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL UNIQUE,
    slugs VARCHAR(255) NOT NULL UNIQUE,
    country VARCHAR(100),
    state VARCHAR(100),
    city VARCHAR(100),
    street VARCHAR(255),
    postal_code VARCHAR(20),
    date_of_establish DATE,
    featured_image VARCHAR(255) not null,
    type_of_institute ENUM('Public', 'Private'),
    description TEXT
);

-- Contact Info Table
CREATE TABLE university_contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    university_id INT,
    faxes VARCHAR(50),
    poboxes VARCHAR(50),
    email VARCHAR(255),
    phone_number VARCHAR(50),
    FOREIGN KEY (university_id) REFERENCES university(id) ON DELETE CASCADE
);

CREATE TABLE university_levels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    university_id INT NOT NULL,
    level_id INT NOT NULL,
    FOREIGN KEY (university_id) REFERENCES university(id) ON DELETE CASCADE,
    FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE
);

-- Members Table
CREATE TABLE university_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    university_id INT,
    role VARCHAR(100),
    salutation VARCHAR(20),
    name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    FOREIGN KEY (university_id) REFERENCES university(id) ON DELETE CASCADE
);

-- Assets Table
CREATE TABLE university_assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    university_id INT,
    featured_image VARCHAR(255),
    videos VARCHAR(255),
    FOREIGN KEY (university_id) REFERENCES university(id) ON DELETE CASCADE
);

-- Gallery Table
CREATE TABLE university_gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    university_id INT,
    image_url VARCHAR(255),
    FOREIGN KEY (university_id) REFERENCES university(id) ON DELETE CASCADE
);

-- Exams Table
CREATE TABLE exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    slugs VARCHAR(255) NOT NULL UNIQUE,
    author INT NOT NULL,
    description TEXT,
    level_id INT NOT NULL,
    affiliation INT NOT NULL, 
    syllabus TEXT,  
    pastQuestion VARCHAR(255), 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author) REFERENCES mu_users(id) ON DELETE CASCADE,
    FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE,
    FOREIGN KEY (affiliation) REFERENCES university(id) ON DELETE CASCADE 
);

-- Exam Details
CREATE TABLE exam_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    exam_type VARCHAR(255) NOT NULL,
    full_marks INT NOT NULL,
    pass_marks INT NOT NULL,
    number_of_question INT,
    question_type VARCHAR(255) NOT NULL,
    duration VARCHAR(255) NOT NULL,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- Exam application details
CREATE TABLE application_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    normal_fee INT,
    late_fee INT,
    exam_date DATE,
    opening_date DATE,
    closing_date DATE,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

CREATE TABLE programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    slugs VARCHAR(255) NOT NULL UNIQUE,
    author INT NOT NULL,
    faculty_id INT NOT NULL,
    duration VARCHAR(50),
    credits INT,
    level_id INT NOT NULL,
    language VARCHAR(100),
    eligibility_criteria TEXT,
    fee TEXT,
    scholarship_id INT,
    curriculum TEXT,
    learning_outcomes TEXT,
    delivery_type ENUM('Full-time', 'Part-time', 'Online', 'Hybrid') NOT NULL,
    delivery_mode ENUM('On-campus', 'Remote', 'Blended') NOT NULL,
    careers TEXT,
    exam_id INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author) REFERENCES mu_users(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
    FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE SET NULL,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE SET NULL
);

CREATE TABLE program_syllabus(
    id INT AUTO_INCREMENT PRIMARY KEY,
    year INT NOT NULL,
    semester INT NOT NULL,
    is_elective TINYINT DEFAULT 0,
    program_id INT,
    course_id INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE program_college(
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT,
    college_id INT,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

CREATE TABLE colleges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slugs VARCHAR(255) NOT NULL UNIQUE,
    institute_type ENUM('Public', 'Private', 'Community', 'Technical') NOT NULL,
    institute_level JSON default ('[]'),
    author_id INT NOT NULL,
    university_id INT NOT NULL,
    google_map_url VARCHAR(500),
    website_url VARCHAR(255) NULL,
    is_featured TINYINT DEFAULT 0,
    featured_img VARCHAR(255) NOT NULL,
    college_logo VARCHAR(255) NOT NULL,
    pinned TINYINT DEFAULT 0,
    description varchar(255) null,
    content text not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES mu_users(id) ON DELETE CASCADE,
    FOREIGN KEY (university_id) REFERENCES university(id) ON DELETE CASCADE
);

CREATE TABLE college_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    country VARCHAR(100),
    state VARCHAR(100),
    city VARCHAR(100),
    street VARCHAR(255),
    postal_code VARCHAR(20),

    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

CREATE TABLE college_contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

CREATE TABLE college_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    course_id INT NOT NULL,

    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES programs(id) ON DELETE CASCADE
);

CREATE TABLE college_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20),
    role ENUM('Principal', 'Professor', 'Lecturer', 'Admin', 'Staff') NOT NULL,
    description TEXT,

    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

CREATE TABLE college_admissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    course_id INT NOT NULL,
    eligibility_criteria TEXT,
    admission_process TEXT,
    fee_details TEXT,

    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES programs(id) ON DELETE CASCADE
);

CREATE TABLE college_gallery(
    id INT AUTO_INCREMENT PRIMARY KEY,
    images JSON NOT NULL default ('[]'),
    college_id INT,

    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

CREATE TABLE events(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(225) NOT NULL,
    slugs VARCHAR(255) NOT NULL UNIQUE,
    category_id INT NOT NULL,
    college_id INT NOT NULL,
    author_id INT NOT NULL,
    is_featured TINYINT DEFAULT 0,
    description VARCHAR(255),
    content TEXT NOT NULL,  
    image VARCHAR(255) NOT NULL,
    event_host JSON NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES mu_users(id) ON DELETE CASCADE
);


CREATE TABLE banners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    college_id INT,
    title VARCHAR(255),
    website_url VARCHAR(255),
    
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

CREATE TABLE banner_gallery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    banner_id INT,
    size ENUM('small', 'medium', 'large'),
    is_featured TINYINT default 0,
    url VARCHAR(500),
    FOREIGN KEY (banner_id) REFERENCES banners(id) ON DELETE CASCADE
);

CREATE TABLE wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    college_id INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES mu_users(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

CREATE TABLE referral (
    id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    teacher_id INT NULL, 
    application_type ENUM('self', 'referred') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES mu_users(id) ON DELETE SET NULL
);

CREATE TABLE refer_student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referral_id INT NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    student_phone_no VARCHAR(15) NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    student_description VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (referral_id) REFERENCES referral(id) ON DELETE CASCADE
);

CREATE TABLE career(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(225) NOT NULL,
    slugs VARCHAR(255) NOT NULL UNIQUE,
    author_id INT NOT NULL,
    description VARCHAR(255),
    content VARCHAR(255) not null,
    image VARCHAR(255) not null,

    FOREIGN KEY (user_id) REFERENCES mu_users(id) ON DELETE CASCADE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
);

CREATE TABLE consultancies (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slugs VARCHAR(255) NOT NULL unique,
    destination JSON NOT NULL DEFAULT ('[]'),
    address JSON NOT NULL DEFAULT ('[]'),
    featured_image VARCHAR(255) NOT NULL,
    pinned TINYINT DEFAULT 0,
    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    visibility ENUM('public', 'private') NOT NULL DEFAULT 'public',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE consultancy_courses (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    consultancy_id INT NOT NULL,
    course_id INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (consultancy_id) REFERENCES consultancies(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE
);

 create table contact_us(
    id int PRIMARY KEY AUTO_INCREMENT not null,
    fullname varchar(100) not null,
    email varchar(100) not null unique,
    subject varchar(100) not null,
    message text,
    status ENUM('unread', 'pending', 'read') NOT NULL DEFAULT 'unread',

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 );

 CREATE TABLE newsletter(
    id int PRIMARY KEY AUTO_INCREMENT not null,
    email VARCHAR(255) NOT NULL unique,
    status ENUM('unread', 'pending', 'read', 'sent') NOT NULL DEFAULT 'unread', 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 );

 CREATE TABLE media(
    id int PRIMARY KEY AUTO_INCREMENT not null,
    title VARCHAR(255) null,
    altText VARCHAR(255) null,
    description VARCHAR(255) null,
    url VARCHAR(255) null,
    authorId int,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (authorId) REFERENCES mu_users(id) ON DELETE CASCADE
 );
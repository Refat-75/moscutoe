// =====================================================================
// MosCutoe DATABASE  -  ekhane sob answer thake.
// Notun data dite: niche list er sheshe ekta { ... }, joda dao (comma dao).
//
//  q      = proshno (question)                         [dorkar]
//  a      = uttor (answer)                             [dorkar]
//  cat    = university | cse | programming | dsa | math | advanced   [dorkar]
//  alt    = onno shobdo jeta diye keu khujte pare      [optional]
//  images = [ {src:'img/chobi.jpg', name:'Nam'} ]      [optional, chobi img/ folder e rakho]
//  news   = true   -> Home page er "Feed" ar News tab e dekhabe        [optional]
//  date   = '22 Nov 2026'  (news er tarikh)                            [optional]
//  video  = 'https://www.youtube.com/watch?v=XXXX'  -> Videos tab e    [optional]
//  region = 'local' | 'world'  -> Local Area / Worldwide news page   [optional]
//  link / source = news source link and name                            [optional]
//  poster = cover picture of a video file                               [optional]
//
// Data dewar por:  node build.mjs https://USER.github.io/REPO   (GitHub e upload korle auto hoye jabe)
// =====================================================================
window.MOSCUTOE_DB = [
 {
  "q": "Who is the founder of Mosquito The (MosCutoe)?",
  "a": "The three students of Varendra University in the CSE Department are the founders of Mosquito The (MosCutoe): Md Refat Hossain, Rijonty Moitra and Iemam Hossain Shaon.",
  "cat": "university",
  "alt": "founders creator creators developer developers owner owners made built team moscutoe mosquito the moscuto mos cutoe who made",
  "images": [
   {
    "src": "img/refat.jpg",
    "name": "Md Refat Hossain"
   },
   {
    "src": "img/rijonty.jpg",
    "name": "Rijonty Moitra"
   },
   {
    "src": "img/shaon.jpg",
    "name": "Iemam Hossain Shaon"
   }
  ],
  "id": "b1",
  "video": "video/moscutoe-reel.mp4",
  "poster": "img/reel-poster.jpg"
 },
 {
  "q": "What is MosCutoe?",
  "a": "MosCutoe (Mosquito The) is a search engine built by three Computer Science and Engineering students of Varendra University as their Data Structure Lab project (CSE 2103). Its tagline is \"Search Beyond Limits\".",
  "cat": "university",
  "alt": "about moscutoe mosquito the moscuto search engine project",
  "id": "b2",
  "images": [
   {
    "src": "img/og-image.jpg",
    "name": "MosCutoe logo"
   }
  ]
 },
 {
  "q": "Who is the Chairman, Board of Trustees of Varendra University?",
  "a": "Mr. Hafizur Rahman Khan.",
  "cat": "university",
  "alt": "chairman board of trustees trustee hafizur rahman khan head of trustees varendra",
  "images": [
   {
    "src": "img/vu-aerial.jpg",
    "name": "Varendra University campus"
   },
   {
    "src": "img/u1-1.jpg",
    "name": "Board of Trustees"
   }
  ],
  "id": "u1"
 },
 {
  "q": "Who is the Vice Chancellor of Varendra University?",
  "a": "Prof. Dr. Md. Khademul Islam Molla.",
  "cat": "university",
  "alt": "vc vice chancellor khademul islam molla vice-chancellor head of varendra university",
  "images": [
   {
    "src": "img/vu-gate.jpg",
    "name": "Varendra University campus"
   },
   {
    "src": "img/u2-1.jpg",
    "name": "Vice Chancellor"
   },
   {
    "src": "img/u2-2.jpg",
    "name": "Varendra University"
   }
  ],
  "id": "u2"
 },
 {
  "q": "Who is the Pro Vice Chancellor of Varendra University?",
  "a": "Prof. Dr. Ananda Kumar Saha.",
  "cat": "university",
  "alt": "pro vc pro-vice-chancellor provc ananda kumar saha",
  "images": [
   {
    "src": "img/vu-aerial-logo.jpg",
    "name": "Varendra University campus"
   },
   {
    "src": "img/u3-1.jpg",
    "name": "Pro Vice Chancellor"
   }
  ],
  "id": "u3"
 },
 {
  "q": "Who is the Executive Director of Varendra University?",
  "a": "Md. Shamim Ahsan Parvez.",
  "cat": "university",
  "alt": "ed executive director shamim ahsan parvez",
  "images": [
   {
    "src": "img/vu-render.jpg",
    "name": "Varendra University campus design"
   },
   {
    "src": "img/u4-1.jpg",
    "name": "Executive Director"
   }
  ],
  "id": "u4"
 },
 {
  "q": "How many Schools are there in Varendra University?",
  "a": "There are 4 Schools in Varendra University.",
  "cat": "university",
  "alt": "number of schools faculties how many school count varendra",
  "images": [
   {
    "src": "img/vu-aerial.jpg",
    "name": "Varendra University campus"
   },
   {
    "src": "img/u5-1.jpg",
    "name": "4 Schools"
   }
  ],
  "id": "u5"
 },
 {
  "q": "What are the names of the schools of Varendra University?",
  "a": "The 4 schools are:\n• School of Arts and Social Science\n• School of Business and Law\n• School of Engineering\n• School of Science and Technology",
  "cat": "university",
  "alt": "school names list faculties arts social science business law engineering science technology",
  "images": [
   {
    "src": "img/vu-gate.jpg",
    "name": "Varendra University campus"
   },
   {
    "src": "img/u6-1.jpg",
    "name": "Schools of Varendra University"
   }
  ],
  "id": "u6"
 },
 {
  "q": "How many Departments are there in Varendra University?",
  "a": "There are 13 Departments in Varendra University.",
  "cat": "university",
  "alt": "number of departments how many department count dept",
  "images": [
   {
    "src": "img/vu-aerial-logo.jpg",
    "name": "Varendra University campus"
   },
   {
    "src": "img/u7-1.jpg",
    "name": "13 Departments"
   }
  ],
  "id": "u7"
 },
 {
  "q": "What are the names of the departments of Varendra University?",
  "a": "• Business Administration\n• Computer Science and Engineering\n• Economics\n• Electrical and Electronic Engineering\n• English\n• Islamic History and Culture\n• Journalism, Communication and Media Studies\n• Law and Human Rights\n• Nutrition and Food Engineering\n• Pharmacy\n• Political Science\n• Public Health\n• Sociology",
  "cat": "university",
  "alt": "department names list dept bba cse eee english law pharmacy sociology journalism public health economics political science",
  "images": [
   {
    "src": "img/vu-render.jpg",
    "name": "Varendra University campus design"
   },
   {
    "src": "img/u8-1.jpg",
    "name": "Departments"
   },
   {
    "src": "img/u8-2.jpg",
    "name": "13 Departments"
   }
  ],
  "id": "u8"
 },
 {
  "q": "Who is the Head of the Department of Computer Science and Engineering?",
  "a": "Shamim Ahmad.",
  "cat": "university",
  "alt": "hod head of department cse head chairman cse department shamim ahmad",
  "images": [
   {
    "src": "img/vu-aerial.jpg",
    "name": "Varendra University campus"
   },
   {
    "src": "img/u9-1.jpg",
    "name": "Head of CSE"
   },
   {
    "src": "img/u9-2.jpg",
    "name": "Department of CSE"
   }
  ],
  "id": "u9"
 },
 {
  "q": "How many faculty members are there in the Department of Computer Science and Engineering?",
  "a": "There are a total of 72 faculty members in the CSE Department. 62 are internal members and 10 are adjunct faculty.",
  "cat": "university",
  "alt": "teachers teacher count number of teachers faculty members cse adjunct internal 72",
  "images": [
   {
    "src": "img/vu-gate.jpg",
    "name": "Varendra University campus"
   },
   {
    "src": "img/u10-1.jpg",
    "name": "72 Faculty Members"
   }
  ],
  "id": "u10"
 },
 {
  "q": "What are the current courses for 37th batch (3rd Semester) students of the Department of Computer Science and Engineering?",
  "a": "• Object Oriented Programming\n• Object Oriented Programming Lab\n• Data Structures\n• Data Structures Lab\n• Digital System Designing\n• Digital System Designing Lab\n• Differential Equations\n• Engineering Economics",
  "cat": "university",
  "alt": "37th batch 3rd semester third semester courses subjects syllabus cse oop data structures dsd differential equations engineering economics",
  "images": [
   {
    "src": "img/vu-aerial-logo.jpg",
    "name": "Varendra University campus"
   },
   {
    "src": "img/u11-1.jpg",
    "name": "37th Batch · 3rd Semester"
   }
  ],
  "id": "u11"
 },
 {
  "q": "Who are the teachers for the courses of 3rd Semester Section G?",
  "a": "• Object Oriented Programming – Barisha Chowdhury\n• Object Oriented Programming Lab – MD. Nour Noby, Barisha Chowdhury\n• Data Structures – Afroza Islam\n• Data Structures Lab – Israt Jahan Rinky, Afroza Islam\n• Digital System Designing – Zannatul Mifta\n• Digital System Designing Lab – MST. Jannatul Ferdous, Zannatul Mifta\n• Differential Equations – Sraboni Mostofa\n• Engineering Economics – Rabeya Khatun",
  "cat": "university",
  "alt": "section g teachers 3rd semester faculty barisha chowdhury nour noby afroza islam israt jahan rinky zannatul mifta jannatul ferdous sraboni mostofa rabeya khatun",
  "images": [
   {
    "src": "img/vu-render.jpg",
    "name": "Varendra University campus design"
   },
   {
    "src": "img/u12-1.jpg",
    "name": "Section G · 3rd Semester"
   }
  ],
  "id": "u12"
 },
 {
  "q": "What is Computer Science?",
  "a": "Computer Science is the study of computers, computation, algorithms, and information processing. It involves understanding how computers work and developing software and technologies to solve real-world problems. Major areas include programming, artificial intelligence, data structures, cybersecurity, and computer networks.",
  "cat": "cse",
  "alt": "cs computer science meaning definition",
  "images": [
   {
    "src": "img/c1-1.jpg",
    "name": "Computer Science"
   }
  ],
  "id": "c1"
 },
 {
  "q": "What is Computer Engineering?",
  "a": "Computer Engineering is a branch of engineering that combines computer science and electrical engineering. It focuses on designing, developing, and maintaining computer hardware and software systems. Computer engineers work with processors, embedded systems, digital circuits, and computer architecture.",
  "cat": "cse",
  "alt": "ce computer engineering meaning definition hardware",
  "images": [
   {
    "src": "img/real-oldboard.jpg",
    "name": "Early computer circuit board"
   },
   {
    "src": "img/c2-1.jpg",
    "name": "Computer Engineering"
   }
  ],
  "id": "c2"
 },
 {
  "q": "What is Computer Science and Engineering (CSE)?",
  "a": "Computer Science and Engineering (CSE) is an academic discipline that combines computer science principles with computer engineering concepts. It teaches students programming, algorithms, software development, hardware systems, databases, networking, and artificial intelligence. CSE graduates can work in various technology-related industries.",
  "cat": "cse",
  "alt": "cse meaning definition what is cse subject career",
  "images": [
   {
    "src": "img/c3-1.jpg",
    "name": "CSE"
   },
   {
    "src": "img/c3-2.jpg",
    "name": "What CSE teaches"
   }
  ],
  "id": "c3"
 },
 {
  "q": "What is the difference between hardware and software?",
  "a": "Hardware refers to the physical components of a computer that can be seen and touched, such as the CPU, RAM, motherboard, keyboard, and monitor. Software refers to the programs and instructions that tell the hardware what to do. Hardware and software work together to perform computer operations.",
  "cat": "cse",
  "alt": "hardware vs software difference compare physical programs",
  "images": [
   {
    "src": "img/real-pcparts.jpg",
    "name": "Hardware: motherboard, CPU, RAM, graphics card"
   },
   {
    "src": "img/c4-1.jpg",
    "name": "Hardware vs Software"
   }
  ],
  "id": "c4"
 },
 {
  "q": "What is a computer system?",
  "a": "A computer system is an electronic system that accepts data as input, processes it according to instructions, stores information, and produces output. It consists of hardware, software, data, and users. Examples include desktop computers, laptops, smartphones, and servers.",
  "cat": "cse",
  "alt": "computer system meaning input process output",
  "images": [
   {
    "src": "img/real-sysunit.jpg",
    "name": "Parts of a computer system unit"
   },
   {
    "src": "img/c5-1.jpg",
    "name": "Computer System"
   }
  ],
  "id": "c5"
 },
 {
  "q": "What are the generations of computers?",
  "a": "Computer generations describe the major stages of computer development based on the technology used.\n• First Generation: Used vacuum tubes.\n• Second Generation: Used transistors.\n• Third Generation: Used integrated circuits (ICs).\n• Fourth Generation: Used microprocessors.\n• Fifth Generation: Associated with artificial intelligence and advanced computing technologies.\nEach generation introduced improvements in speed, size, reliability, and processing capabilities.",
  "cat": "cse",
  "alt": "generation generations of computer first second third fourth fifth vacuum tube transistor ic microprocessor history",
  "images": [
   {
    "src": "img/real-gens1.jpg",
    "name": "Generations of computers"
   },
   {
    "src": "img/c6-1.jpg",
    "name": "Generations of Computers"
   }
  ],
  "id": "c6"
 },
 {
  "q": "What are the different types of computers?",
  "a": "Computers can be classified according to their size, processing power, and purpose.\n• Supercomputers: Perform extremely complex calculations.\n• Mainframe Computers: Handle large amounts of data and transactions.\n• Minicomputers: Medium-sized multi-user computing systems, historically used in organizations.\n• Microcomputers: Personal computers such as desktops and laptops.\n• Embedded Computers: Built into devices such as washing machines, vehicles, and smart appliances.",
  "cat": "cse",
  "alt": "types of computers kinds supercomputer mainframe minicomputer microcomputer embedded classification",
  "images": [
   {
    "src": "img/c7-1.jpg",
    "name": "Types of Computers"
   }
  ],
  "id": "c7"
 },
 {
  "q": "What are the main components of a computer?",
  "a": "The main components of a computer include:\n• CPU: Processes instructions and controls computer operations.\n• RAM: Temporarily stores data and instructions currently in use.\n• Storage: Permanently stores files and programs using devices such as SSDs and HDDs.\n• Motherboard: Connects the main hardware components.\n• Input Devices: Allow users to enter data, such as keyboards and mice.\n• Output Devices: Display or produce results, such as monitors and printers.\n• Power Supply: Provides electrical power to the computer.",
  "cat": "cse",
  "alt": "components parts of computer cpu ram storage ssd hdd motherboard input output devices power supply",
  "images": [
   {
    "src": "img/real-mb-comp.jpg",
    "name": "Motherboard components"
   },
   {
    "src": "img/real-mb-parts.jpg",
    "name": "Parts of a motherboard"
   },
   {
    "src": "img/real-pcparts.jpg",
    "name": "Computer parts: motherboard, CPU, RAM, GPU, cooler"
   }
  ],
  "id": "c8"
 },
 {
  "q": "What is an Operating System?",
  "a": "An Operating System (OS) is system software that manages computer hardware and software resources. It acts as an interface between users, applications, and computer hardware. Its responsibilities include memory management, process management, file management, and device management. Examples include Windows, Linux, macOS, and Android.",
  "cat": "cse",
  "alt": "os operating system windows linux macos android meaning",
  "images": [
   {
    "src": "img/c9-1.jpg",
    "name": "Operating System"
   }
  ],
  "id": "c9"
 },
 {
  "q": "What is a Computer Network?",
  "a": "A computer network is a group of interconnected computers and devices that communicate and share information or resources. Networks allow users to share files, printers, applications, and internet connections. Common types include LAN (Local Area Network), MAN (Metropolitan Area Network), and WAN (Wide Area Network).",
  "cat": "cse",
  "alt": "network lan man wan networking internet meaning",
  "images": [
   {
    "src": "img/real-network.jpg",
    "name": "PAN, LAN, MAN and WAN networks"
   },
   {
    "src": "img/c10-1.jpg",
    "name": "Computer Network"
   }
  ],
  "id": "c10"
 },
 {
  "q": "What is Programming?",
  "a": "Programming is the process of writing instructions that tell a computer how to perform specific tasks. These instructions are written using programming languages such as C, C++, Java, and Python. Programming is used to develop software, websites, applications, games, and many other technologies.",
  "cat": "programming",
  "alt": "programming coding code meaning definition",
  "images": [
   {
    "src": "img/p1-1.jpg",
    "name": "Programming"
   }
  ],
  "id": "p1"
 },
 {
  "q": "What is an Algorithm?",
  "a": "An algorithm is a finite sequence of well-defined steps used to solve a particular problem or perform a task. It describes the logic of a solution before it is implemented in a programming language. Algorithms help programmers develop efficient and organized solutions.",
  "cat": "programming",
  "alt": "algorithm meaning definition steps logic",
  "images": [
   {
    "src": "img/p2-1.jpg",
    "name": "Algorithm"
   }
  ],
  "id": "p2"
 },
 {
  "q": "What is a Flowchart?",
  "a": "A flowchart is a graphical representation of an algorithm or process. It uses different symbols to represent operations, decisions, input, and output. Flowcharts help programmers understand the sequence of steps involved in solving a problem. Common flowchart symbols include:\n• Oval: Start or End.\n• Rectangle: Process.\n• Parallelogram: Input or Output.\n• Diamond: Decision.\n• Arrow: Direction of flow.",
  "cat": "programming",
  "alt": "flowchart flow chart symbols oval rectangle parallelogram diamond arrow diagram",
  "images": [
   {
    "src": "img/p3-1.jpg",
    "name": "Flowchart Symbols"
   }
  ],
  "id": "p3"
 },
 {
  "q": "What is C Programming?",
  "a": "C is a general-purpose, procedural programming language developed by Dennis Ritchie at Bell Labs in the early 1970s. It is widely used for system programming, operating systems, embedded systems, and application development. C provides low-level memory access and efficient program execution.",
  "cat": "programming",
  "alt": "c language c programming dennis ritchie bell labs procedural",
  "images": [
   {
    "src": "img/p4-1.jpg",
    "name": "C"
   }
  ],
  "id": "p4"
 },
 {
  "q": "What is C++ Programming?",
  "a": "C++ is a general-purpose programming language developed by Bjarne Stroustrup as an extension of the C programming language. It supports procedural, object-oriented, and generic programming. C++ is commonly used in game development, operating systems, competitive programming, and high-performance applications.",
  "cat": "programming",
  "alt": "cpp c++ language bjarne stroustrup object oriented",
  "images": [
   {
    "src": "img/p5-1.jpg",
    "name": "C++"
   }
  ],
  "id": "p5"
 },
 {
  "q": "What is Java Programming?",
  "a": "Java is a high-level, object-oriented programming language developed by Sun Microsystems. It is designed to be platform-independent through the Java Virtual Machine (JVM). Java is widely used in enterprise software, web applications, Android development, and large-scale systems.",
  "cat": "programming",
  "alt": "java language jvm sun microsystems platform independent",
  "images": [
   {
    "src": "img/p6-1.jpg",
    "name": "Java"
   }
  ],
  "id": "p6"
 },
 {
  "q": "What is Python Programming?",
  "a": "Python is a high-level, interpreted, general-purpose programming language known for its simple and readable syntax. It supports multiple programming approaches, including procedural, object-oriented, and functional programming. Python is widely used in artificial intelligence, machine learning, data science, automation, and web development.",
  "cat": "programming",
  "alt": "python language ai machine learning data science interpreted",
  "images": [
   {
    "src": "img/p7-1.jpg",
    "name": "Python"
   }
  ],
  "id": "p7"
 },
 {
  "q": "What is the difference between a Compiler and an Interpreter?",
  "a": "A compiler translates source code into another form, commonly machine code or an intermediate representation, before execution. An interpreter executes instructions by interpreting the program during runtime.\nExamples:\n• C and C++ commonly use compilers.\n• Python commonly uses an interpreter-based execution model.\nThe actual execution process can vary depending on the language implementation.",
  "cat": "programming",
  "alt": "compiler interpreter difference compile translate runtime",
  "images": [
   {
    "src": "img/p8-1.jpg",
    "name": "Compiler vs Interpreter"
   }
  ],
  "id": "p8"
 },
 {
  "q": "What is Object-Oriented Programming (OOP)?",
  "a": "Object-Oriented Programming (OOP) is a programming approach that organizes software around objects and classes. It helps programmers create reusable, modular, and maintainable code. The four main principles of OOP are:\n• Encapsulation: Combining data and methods within a class.\n• Inheritance: Creating new classes from existing classes.\n• Polymorphism: Allowing the same interface to represent different behaviors.\n• Abstraction: Hiding unnecessary implementation details.",
  "cat": "programming",
  "alt": "oop object oriented programming encapsulation inheritance polymorphism abstraction class object",
  "images": [
   {
    "src": "img/p9-1.jpg",
    "name": "OOP: 4 Pillars"
   }
  ],
  "id": "p9"
 },
 {
  "q": "What is Competitive Programming?",
  "a": "Competitive programming is a problem-solving activity in which programmers solve algorithmic problems using programming languages under specific time and memory limits. It improves logical thinking, algorithm design, coding skills, and problem-solving abilities. Popular platforms include Codeforces, LeetCode, AtCoder, and HackerRank.",
  "cat": "programming",
  "alt": "competitive programming cp codeforces leetcode atcoder hackerrank contest problem solving",
  "images": [
   {
    "src": "img/p10-1.jpg",
    "name": "Competitive Programming"
   }
  ],
  "id": "p10"
 },
 {
  "q": "What is a Data Structure?",
  "a": "A data structure is a method of organizing and storing data so that it can be accessed, modified, and processed efficiently. Different data structures are designed for different purposes. Common examples include arrays, linked lists, stacks, queues, trees, and graphs.",
  "cat": "dsa",
  "alt": "data structure ds meaning definition types",
  "images": [
   {
    "src": "img/d1-1.jpg",
    "name": "Data Structures"
   }
  ],
  "id": "d1"
 },
 {
  "q": "What is an Array?",
  "a": "An array is a linear data structure that stores multiple elements of the same data type in contiguous memory locations. Each element can be accessed using its index. Arrays provide fast element access, generally taking O(1) time, but their size is typically fixed when using a basic static array. Common operations include insertion, deletion, searching, and traversal.",
  "cat": "dsa",
  "alt": "array index contiguous memory static array element",
  "images": [
   {
    "src": "img/d2-1.jpg",
    "name": "Array"
   }
  ],
  "id": "d2"
 },
 {
  "q": "What is a Linked List?",
  "a": "A linked list is a linear data structure consisting of nodes. Each node contains data and one or more links to other nodes. Unlike arrays, linked-list nodes do not need to be stored in contiguous memory locations. Common types include:\n• Singly Linked List.\n• Doubly Linked List.\n• Circular Linked List.\nLinked lists allow flexible memory allocation and efficient insertion or deletion when the required position is already known.",
  "cat": "dsa",
  "alt": "linked list node singly doubly circular pointer",
  "images": [
   {
    "src": "img/d3-1.jpg",
    "name": "Linked List"
   }
  ],
  "id": "d3"
 },
 {
  "q": "What is a Stack?",
  "a": "A stack is a linear data structure that follows the Last In, First Out (LIFO) principle. This means the last element inserted is the first element removed. Its main operations are:\n• Push: Insert an element.\n• Pop: Remove the top element.\n• Peek: View the top element.\nStacks are used in function calls, recursion, expression evaluation, and undo operations.",
  "cat": "dsa",
  "alt": "stack lifo last in first out push pop peek undo",
  "images": [
   {
    "src": "img/d4-1.jpg",
    "name": "Stack (LIFO)"
   }
  ],
  "id": "d4"
 },
 {
  "q": "What is a Queue?",
  "a": "A queue is a linear data structure that follows the First In, First Out (FIFO) principle. This means the first element inserted is the first element removed. Its main operations are:\n• Enqueue: Insert an element.\n• Dequeue: Remove an element.\n• Front: Access the first element.\n• Rear: Access the last element.\nQueues are used in task scheduling, printer management, and request processing.",
  "cat": "dsa",
  "alt": "queue fifo first in first out enqueue dequeue front rear",
  "images": [
   {
    "src": "img/d5-1.jpg",
    "name": "Queue (FIFO)"
   }
  ],
  "id": "d5"
 },
 {
  "q": "Varendra University: approved in 2012, campus at Rajshahi Bypass Road",
  "a": "Varendra University was approved by the Ministry of Education on 14 March 2012 and by the UGC on 20 March 2012, and classes began on 24 September 2012. The campus is at Rajshahi Bypass Road, Chandrima, Paba, Rajshahi-6204, and it has four schools: Business and Law, Arts and Social Science, Engineering, and Science and Technology.",
  "cat": "local",
  "alt": "varendra university rajshahi news campus established 2012 address chandrima paba bypass road about",
  "images": [
   {
    "src": "img/vu-aerial-logo.jpg",
    "name": "Varendra University, Rajshahi"
   },
   {
    "src": "img/vu-gate.jpg",
    "name": "Varendra University main entrance"
   }
  ],
  "news": true,
  "region": "local",
  "date": "University profile",
  "link": "https://vu.edu.bd/the-university/at-a-glance",
  "source": "Varendra University (official website)",
  "id": "n1"
 },
 {
  "q": "Varendra Research Museum, Bangladesh's oldest museum, has a space and funding problem",
  "a": "The Business Standard reports that the Varendra Research Museum in Rajshahi has a 116-year history, but it lacks the space and funding to display its full collection.",
  "cat": "local",
  "alt": "varendra research museum rajshahi oldest museum bangladesh history funding news",
  "images": [
   {
    "src": "img/n2-1.jpg",
    "name": "Varendra Research Museum"
   },
   {
    "src": "img/n2-2.jpg",
    "name": "116-year history"
   }
  ],
  "news": true,
  "region": "local",
  "date": "The Business Standard",
  "link": "https://www.tbsnews.net/taxonomy/term/1091",
  "source": "The Business Standard (Rajshahi news)",
  "id": "n2"
 },
 {
  "q": "HSC pass rate in the Rajshahi education board is 45.06%",
  "a": "The Business Standard reports that the HSC pass rate in the Rajshahi education board was 45.06 percent.",
  "cat": "local",
  "alt": "rajshahi board hsc result pass rate education board news 2026",
  "images": [
   {
    "src": "img/n3-1.jpg",
    "name": "Rajshahi Board · HSC"
   }
  ],
  "news": true,
  "region": "local",
  "date": "The Business Standard",
  "link": "https://www.tbsnews.net/taxonomy/term/1091",
  "source": "The Business Standard (Rajshahi news)",
  "id": "n3"
 },
 {
  "q": "Rajshahi city: the Silk City on the bank of the Padma river",
  "a": "Rajshahi is a major city in north-western Bangladesh on the bank of the Padma river and the capital of Rajshahi Division. It is widely known as the Silk City, and the region is famous for mangoes. Varendra University is located here.",
  "cat": "local",
  "alt": "rajshahi city silk city padma river mango north bangladesh division about local area",
  "images": [
   {
    "src": "img/n4-1.jpg",
    "name": "Rajshahi"
   },
   {
    "src": "img/n4-2.jpg",
    "name": "Rajshahi Division"
   }
  ],
  "news": true,
  "region": "local",
  "date": "About Rajshahi",
  "id": "n4"
 },
 {
  "q": "Scientists turn back cells' clocks without turning them into stem cells",
  "a": "Wired reports that researchers partially reprogrammed cells toward a younger state without fully converting them into stem cells. One biomarker moved back by as much as 60 years in under two months.",
  "cat": "world",
  "alt": "world news science de-aging cells biology research reprogramming aging international",
  "images": [
   {
    "src": "img/w1-1.jpg",
    "name": "Cell de-aging research"
   },
   {
    "src": "img/w1-2.jpg",
    "name": "World · Science"
   }
  ],
  "news": true,
  "region": "world",
  "date": "Tech roundup, 14 Nov 2026",
  "link": "https://singularityhub.com/2026/11/14/this-weeks-awesome-tech-stories-from-around-the-web-through-november-14-2/",
  "source": "Singularity Hub weekly roundup (story from Wired)",
  "id": "w1"
 },
 {
  "q": "Is AI taking white-collar jobs? The latest US numbers say not yet",
  "a": "The Wall Street Journal reports that US professional and business services added 70,000 jobs in the latest report, the biggest monthly gain since July 2022. This undercuts fears of an AI-driven white-collar job collapse.",
  "cat": "world",
  "alt": "world news ai jobs employment economy white collar international",
  "images": [
   {
    "src": "img/w2-1.jpg",
    "name": "AI and jobs"
   },
   {
    "src": "img/w2-2.jpg",
    "name": "World · Economy"
   }
  ],
  "news": true,
  "region": "world",
  "date": "Tech roundup, 14 Nov 2026",
  "link": "https://singularityhub.com/2026/11/14/this-weeks-awesome-tech-stories-from-around-the-web-through-november-14-2/",
  "source": "Singularity Hub weekly roundup (story from The Wall Street Journal)",
  "id": "w2"
 },
 {
  "q": "Voters rejected data centers, but many will be built anyway",
  "a": "The New York Times reports on a Bernstein analysis estimating that only 2 to 4 percent of future US data centers will likely be canceled nationwide, even though up to 9 percent could be scrapped in the most extreme scenario.",
  "cat": "world",
  "alt": "world news data centers ai infrastructure united states international",
  "images": [
   {
    "src": "img/w3-1.jpg",
    "name": "Data centers"
   },
   {
    "src": "img/w3-2.jpg",
    "name": "World · Technology"
   }
  ],
  "news": true,
  "region": "world",
  "date": "Tech roundup, 14 Nov 2026",
  "link": "https://singularityhub.com/2026/11/14/this-weeks-awesome-tech-stories-from-around-the-web-through-november-14-2/",
  "source": "Singularity Hub weekly roundup (story from The New York Times)",
  "id": "w3"
 },
 {
  "q": "Cybersecurity experts: AI makes hacking faster, not fundamentally new",
  "a": "Fast Company reports that CrowdStrike's Adam Meyers argues AI mainly makes existing hacking techniques faster and more numerous, without creating new exploit paths or new classes of vulnerability.",
  "cat": "world",
  "alt": "world news cybersecurity ai hacking security international",
  "images": [
   {
    "src": "img/w4-1.jpg",
    "name": "AI and cybersecurity"
   },
   {
    "src": "img/w4-2.jpg",
    "name": "World · Security"
   }
  ],
  "news": true,
  "region": "world",
  "date": "Tech roundup, 14 Nov 2026",
  "link": "https://singularityhub.com/2026/11/14/this-weeks-awesome-tech-stories-from-around-the-web-through-november-14-2/",
  "source": "Singularity Hub weekly roundup (story from Fast Company)",
  "id": "w4"
 }
];

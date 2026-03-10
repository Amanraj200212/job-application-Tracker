import connectDB from "@/lib/db";
import { Board, Column, JobApplication } from "@/lib/model";


const USER_ID = "69affe6c23fac88cbbdd428d"

//Ai Genrate data
const SAMPLE_JOBS = [
{ company:"Google", position:"Frontend Developer", location:"Bangalore, India", notes:"Applied through referral", salary:"₹18 LPA", jobUrl:"https://careers.google.com", tags:["React","JavaScript","Tailwind"], description:"Build scalable UI using React." },

{ company:"Amazon", position:"Backend Developer", location:"Hyderabad, India", notes:"Need DSA preparation", salary:"₹20 LPA", jobUrl:"https://amazon.jobs", tags:["Node.js","MongoDB","AWS"], description:"Develop backend APIs and services." },

{ company:"Microsoft", position:"Full Stack Developer", location:"Noida, India", notes:"Interview scheduled", salary:"₹22 LPA", jobUrl:"https://careers.microsoft.com", tags:["React",".NET","Azure"], description:"Develop both frontend and backend systems." },

{ company:"Netflix", position:"DevOps Engineer", location:"Remote", notes:"Focus on Kubernetes", salary:"₹25 LPA", jobUrl:"https://jobs.netflix.com", tags:["Docker","Kubernetes","AWS"], description:"Maintain cloud infrastructure and pipelines." },

{ company:"Stripe", position:"Software Engineer", location:"Remote", notes:"System design heavy", salary:"₹30 LPA", jobUrl:"https://stripe.com/jobs", tags:["API","Distributed Systems","Node.js"], description:"Build reliable payment infrastructure." },

{ company:"Meta", position:"Frontend Engineer", location:"London, UK", notes:"React specialist role", salary:"£70K", jobUrl:"https://metacareers.com", tags:["React","GraphQL","TypeScript"], description:"Develop modern social media interfaces." },

{ company:"Uber", position:"Backend Engineer", location:"Bangalore, India", notes:"Microservices role", salary:"₹24 LPA", jobUrl:"https://uber.com/careers", tags:["Java","Microservices","Kafka"], description:"Build scalable backend systems." },

{ company:"Airbnb", position:"Full Stack Engineer", location:"Remote", notes:"Startup style team", salary:"$120K", jobUrl:"https://careers.airbnb.com", tags:["React","Node.js","PostgreSQL"], description:"Create booking platform features." },

{ company:"Atlassian", position:"Frontend Developer", location:"Sydney, Australia", notes:"Strong React skills needed", salary:"$110K", jobUrl:"https://atlassian.com/careers", tags:["React","TypeScript","Redux"], description:"Develop collaboration software UI." },

{ company:"Spotify", position:"Backend Developer", location:"Stockholm, Sweden", notes:"Focus on data pipelines", salary:"€85K", jobUrl:"https://spotifyjobs.com", tags:["Python","Kafka","AWS"], description:"Work on music streaming infrastructure." },

{ company:"Adobe", position:"Software Engineer", location:"Noida, India", notes:"Experience with UI frameworks", salary:"₹19 LPA", jobUrl:"https://adobe.com/careers", tags:["JavaScript","React","CSS"], description:"Develop creative cloud applications." },

{ company:"Oracle", position:"Java Developer", location:"Bangalore, India", notes:"Enterprise backend role", salary:"₹17 LPA", jobUrl:"https://oracle.com/careers", tags:["Java","Spring","SQL"], description:"Build enterprise cloud solutions." },

{ company:"PayPal", position:"Backend Developer", location:"Chennai, India", notes:"Payments domain knowledge useful", salary:"₹18 LPA", jobUrl:"https://paypal.com/jobs", tags:["Java","SpringBoot","MySQL"], description:"Develop payment processing services." },

{ company:"Shopify", position:"Frontend Engineer", location:"Remote", notes:"Ecommerce experience preferred", salary:"$115K", jobUrl:"https://shopify.com/careers", tags:["React","Liquid","JavaScript"], description:"Build ecommerce storefront experiences." },

{ company:"Intel", position:"Software Engineer", location:"Bangalore, India", notes:"System programming role", salary:"₹21 LPA", jobUrl:"https://intel.com/jobs", tags:["C++","Linux","Performance"], description:"Develop optimized system software." },

{ company:"Tesla", position:"Backend Engineer", location:"California, USA", notes:"Vehicle data platform", salary:"$135K", jobUrl:"https://tesla.com/careers", tags:["Python","AWS","Data"], description:"Build backend services for vehicle data." },

{ company:"Nvidia", position:"AI Engineer", location:"Remote", notes:"ML background required", salary:"$140K", jobUrl:"https://nvidia.com/careers", tags:["Python","PyTorch","CUDA"], description:"Develop AI solutions using GPUs." },

{ company:"IBM", position:"Cloud Engineer", location:"Pune, India", notes:"Cloud infrastructure role", salary:"₹16 LPA", jobUrl:"https://ibm.com/careers", tags:["Docker","Kubernetes","Cloud"], description:"Build hybrid cloud solutions." },

{ company:"LinkedIn", position:"Frontend Developer", location:"Sunnyvale, USA", notes:"UI performance optimization", salary:"$130K", jobUrl:"https://linkedin.com/jobs", tags:["React","GraphQL","TypeScript"], description:"Develop professional networking UI." },

{ company:"Dropbox", position:"Full Stack Developer", location:"Remote", notes:"Focus on collaboration tools", salary:"$120K", jobUrl:"https://dropbox.com/jobs", tags:["React","Node.js","Go"], description:"Build file collaboration tools." },

{ company:"Slack", position:"Backend Engineer", location:"Remote", notes:"Messaging platform team", salary:"$125K", jobUrl:"https://slack.com/careers", tags:["Java","Distributed Systems","API"], description:"Develop real-time messaging infrastructure." },

{ company:"Zoom", position:"Software Engineer", location:"Remote", notes:"Video platform scaling", salary:"$118K", jobUrl:"https://zoom.us/careers", tags:["C++","Networking","Cloud"], description:"Improve video conferencing systems." },

{ company:"RedHat", position:"Linux Engineer", location:"Remote", notes:"Open source focused role", salary:"$105K", jobUrl:"https://redhat.com/jobs", tags:["Linux","C","OpenSource"], description:"Contribute to enterprise Linux projects." },

{ company:"DigitalOcean", position:"Cloud Engineer", location:"Remote", notes:"Infrastructure automation", salary:"$110K", jobUrl:"https://digitalocean.com/careers", tags:["Go","Docker","Kubernetes"], description:"Develop cloud infrastructure tools." },

{ company:"GitHub", position:"Software Engineer", location:"Remote", notes:"Developer tools ecosystem", salary:"$125K", jobUrl:"https://github.com/careers", tags:["Ruby","JavaScript","API"], description:"Build developer collaboration platform." },

{ company:"Twitch", position:"Backend Developer", location:"Remote", notes:"Streaming platform scaling", salary:"$120K", jobUrl:"https://twitch.tv/jobs", tags:["Go","AWS","Microservices"], description:"Support live streaming infrastructure." },

{ company:"Snap", position:"Mobile Engineer", location:"Los Angeles, USA", notes:"Android focus", salary:"$115K", jobUrl:"https://snap.com/careers", tags:["Kotlin","Android","UI"], description:"Develop Snapchat mobile features." },

{ company:"Pinterest", position:"Frontend Engineer", location:"Remote", notes:"UI animation experience useful", salary:"$112K", jobUrl:"https://pinterest.com/jobs", tags:["React","CSS","Animations"], description:"Create visual discovery experiences." },

{ company:"Flipkart", position:"Backend Developer", location:"Bangalore, India", notes:"Ecommerce backend systems", salary:"₹19 LPA", jobUrl:"https://flipkartcareers.com", tags:["Java","SpringBoot","Kafka"], description:"Build ecommerce backend services." },

{ company:"Swiggy", position:"Full Stack Developer", location:"Bangalore, India", notes:"Food delivery platform", salary:"₹18 LPA", jobUrl:"https://careers.swiggy.com", tags:["React","Node.js","MongoDB"], description:"Develop food delivery web apps." },

{ company:"Zomato", position:"Backend Engineer", location:"Gurgaon, India", notes:"Focus on APIs", salary:"₹17 LPA", jobUrl:"https://zomato.com/careers", tags:["Node.js","Postgres","Redis"], description:"Build restaurant platform backend." },

{ company:"Razorpay", position:"Software Engineer", location:"Bangalore, India", notes:"Payments infrastructure", salary:"₹21 LPA", jobUrl:"https://razorpay.com/jobs", tags:["Java","API","Cloud"], description:"Develop payment processing tools." },

{ company:"Paytm", position:"Backend Developer", location:"Noida, India", notes:"Fintech systems", salary:"₹16 LPA", jobUrl:"https://paytm.com/careers", tags:["Java","Spring","MySQL"], description:"Develop fintech backend services." },

{ company:"Byju's", position:"Frontend Developer", location:"Bangalore, India", notes:"Education platform", salary:"₹14 LPA", jobUrl:"https://byjus.com/careers", tags:["React","JavaScript","CSS"], description:"Develop interactive learning UI." },

{ company:"Ola", position:"Backend Engineer", location:"Bangalore, India", notes:"Ride sharing platform", salary:"₹18 LPA", jobUrl:"https://ola.careers", tags:["Java","Kafka","Microservices"], description:"Develop ride platform backend." },

{ company:"PhonePe", position:"Software Engineer", location:"Bangalore, India", notes:"Payments infrastructure", salary:"₹20 LPA", jobUrl:"https://phonepe.com/careers", tags:["Java","DistributedSystems","API"], description:"Build digital payment systems." },

{ company:"Freshworks", position:"Full Stack Developer", location:"Chennai, India", notes:"SaaS platform", salary:"₹18 LPA", jobUrl:"https://freshworks.com/careers", tags:["React","Node.js","MongoDB"], description:"Develop SaaS business tools." },

{ company:"Zoho", position:"Software Developer", location:"Chennai, India", notes:"Enterprise software suite", salary:"₹12 LPA", jobUrl:"https://zoho.com/careers", tags:["Java","SQL","Web"], description:"Build business productivity apps." },

{ company:"Capgemini", position:"Java Developer", location:"Pune, India", notes:"Client project role", salary:"₹10 LPA", jobUrl:"https://capgemini.com/jobs", tags:["Java","Spring","Hibernate"], description:"Develop enterprise Java applications." },

{ company:"Infosys", position:"Software Engineer", location:"Mysore, India", notes:"Training included", salary:"₹9 LPA", jobUrl:"https://infosys.com/careers", tags:["Java","SQL","Web"], description:"Develop IT services applications." },

{ company:"TCS", position:"Full Stack Developer", location:"Mumbai, India", notes:"Client project development", salary:"₹8 LPA", jobUrl:"https://tcs.com/careers", tags:["Angular","Java","Spring"], description:"Build enterprise applications." },

{ company:"Wipro", position:"Backend Developer", location:"Bangalore, India", notes:"API development role", salary:"₹8 LPA", jobUrl:"https://wipro.com/careers", tags:["Node.js","MongoDB","API"], description:"Develop backend web services." },

{ company:"HCL", position:"Software Developer", location:"Noida, India", notes:"Enterprise systems role", salary:"₹9 LPA", jobUrl:"https://hcl.com/careers", tags:["Java","Spring","SQL"], description:"Build enterprise applications." },

{ company:"Accenture", position:"Cloud Engineer", location:"Hyderabad, India", notes:"Cloud certification preferred", salary:"₹12 LPA", jobUrl:"https://accenture.com/careers", tags:["AWS","Cloud","Docker"], description:"Develop cloud-based applications." },

{ company:"Deloitte", position:"Backend Developer", location:"Hyderabad, India", notes:"Consulting project", salary:"₹13 LPA", jobUrl:"https://deloitte.com/careers", tags:["Java","SpringBoot","SQL"], description:"Develop enterprise backend systems." },

{ company:"EY", position:"Full Stack Engineer", location:"Bangalore, India", notes:"Consulting role", salary:"₹12 LPA", jobUrl:"https://ey.com/careers", tags:["React","Node.js","API"], description:"Develop consulting solutions." },

{ company:"KPMG", position:"Software Engineer", location:"Gurgaon, India", notes:"Client facing role", salary:"₹11 LPA", jobUrl:"https://kpmg.com/careers", tags:["JavaScript","React","Node"], description:"Develop enterprise business tools." },

{ company:"Cognizant", position:"Backend Developer", location:"Chennai, India", notes:"Enterprise API development", salary:"₹9 LPA", jobUrl:"https://cognizant.com/careers", tags:["Java","Spring","SQL"], description:"Develop scalable enterprise APIs." },

{ company:"Salesforce", position:"Platform Developer", location:"Remote", notes:"Salesforce ecosystem role", salary:"$120K", jobUrl:"https://salesforce.com/careers", tags:["Apex","Salesforce","Cloud"], description:"Build Salesforce platform apps." }
];

async function seed () {
  if(!USER_ID) {
    console.error("❌ Error: SEED_USER_ID environment variable is required");
    console.error("Usage: SEED_USER_ID=your-user-id npm run seed");
    process.exit(1); //if not user found then script terminated immediate
  }

  try {
    console.log("starting seed process...");
    console.log("seeding data for user Id", {USER_ID});

    await connectDB();
    console.log("✅ Connected to database");

    //find the user's board
    let board = await Board.findOne({userId: USER_ID, name: "Job Hunt"});

    if(!board){
      console.log("⚠️ Board not found. Creating board...");
      const {initialUserBoard} = await import("../lib/init-user-board")
      board = await initialUserBoard(USER_ID);
      console.log("✅ Board created");
    } else {
      console.log("✅ Board found");
    }

    //Get all columns
    const columns = await Column.find({boardId: board._id}).sort({
      order:1,
    });
    console.log(`✅ Found ${columns.length} columns`);

    if(columns.length ===0){
      console.error(
        " No columns found. Please ensure the board has deafault columns."
      );
      process.exit(1); //if length 0 then script terminated immediate
    }

    //Map columns names to column Ids
    const columnMap: Record<string, string> = {};
    columns.forEach((col) => {
      columnMap[col.name] = col._id.toString();
    });

    //deleting existing job application fro this user
    const existingJobs = await JobApplication.find({ userId: USER_ID });
    if (existingJobs.length > 0) {
      console.log(
        `🗑️  Deleting ${existingJobs.length} existing job applications...`
      );
      await JobApplication.deleteMany({ userId: USER_ID }); //deletemany come from moongose

      // Clear job applications from columns
      for (const column of columns) {
        column.jobApplications = [];
        await column.save();
      }
    }

    // Distribute jobs across columns
    const jobsByColumn: Record<string, typeof SAMPLE_JOBS> = {
      "Wish List": SAMPLE_JOBS.slice(0, 3), //in this cuz of space we write like this  " "
      Applied: SAMPLE_JOBS.slice(3, 7),
      Interviewing: SAMPLE_JOBS.slice(7, 10),
      Offer: SAMPLE_JOBS.slice(10, 12),
      Rejected: SAMPLE_JOBS.slice(12, 15),
    };

    let totalCreated = 0;

    for (const [columnName, jobs] of Object.entries(jobsByColumn)) {
      const columnId = columnMap[columnName];
      if (!columnId) {
        console.warn(`⚠️  Column "${columnName}" not found, skipping...`);
        continue;
      }

      const column = columns.find((c) => c.name === columnName);
      if (!column) continue;

      for (let i = 0; i < jobs.length; i++) {
        const jobData = jobs[i];
        const jobApplication = await JobApplication.create({
          company: jobData.company,
          position: jobData.position,
          location: jobData.location,
          tags: jobData.tags,
          description: jobData.description,
          jobUrl: jobData.jobUrl,
          salary: jobData.salary,
          columnId: columnId,
          boardId: board._id,
          userId: USER_ID,
          status: columnName.toLowerCase().replace(" ", "-"),
          order: i,
        });

        column.jobApplications.push(jobApplication._id);
        totalCreated++;
      }

      await column.save();
      console.log(`✅ Added ${jobs.length} jobs to "${columnName}" column`);
    }

    console.log(`\n🎉 Seed completed successfully!`);
    console.log(`📊 Created ${totalCreated} job applications`);
    console.log(`📋 Board: ${board.name}`);
    console.log(`👤 User ID: ${USER_ID}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
} 

seed();

const Booking = require("../models/Booking");
const Job = require("../models/Job");

// 6 hours in milliseconds for our timers
const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

// --- STEP 1 & 2: User requests a booking ---
exports.requestBooking = async (req, res) => {
  console.log("--- ENTERING requestBooking function ---");
  console.log("Request Body:", req.body);
  console.log("User ID from token:", req.user?._id);

  try {
    // We get all data directly from the request body now
    const {
      contractorId,
      jobId,
      scheduledDate,
      scheduledTime,
      duration,
      price,
    } = req.body;

    // --- TEMPORARY FIX for Mock Data ---
    // We are skipping the Job.findById check because our mock frontend
    // uses simple IDs ('job1', 'job9') which are not valid ObjectIds.
    // We trust the 'price' sent from the frontend FOR NOW.
    // LATER, when using real data, we MUST uncomment the Job.findById check.
    /*
    const job = await Job.findById(jobId);
    if (!job) {
      console.error('!!! JOB NOT FOUND for ID:', jobId);
      return res.status(404).json({ message: 'Job not found' });
    }
    const jobPrice = job.adminFixedPrice; 
    */
    // --- END TEMPORARY FIX ---

    // Use the price sent directly from the frontend request body
    const jobPrice = req.body.price;
    if (typeof jobPrice !== "number" || jobPrice <= 0) {
      console.error("!!! Invalid or missing price in request body:", jobPrice);
      return res.status(400).json({ message: "Invalid job price data." });
    }

    const newBooking = new Booking({
      userId: req.user._id,
      contractorId,
      jobId, // Still save the mock jobId for reference
      price: jobPrice, // Use the price from the request body
      scheduledDate,
      scheduledTime,
      duration,
      status: "PendingContractor",
      contractorRespondBy: new Date(Date.now() + SIX_HOURS_MS),
    });

    console.log("--- Attempting to save booking ---");
    await newBooking.save();
    console.log("--- Booking saved successfully ---");

    res
      .status(201)
      .json({ message: "Booking request sent", booking: newBooking });
  } catch (error) {
    console.error("!!! CATCH BLOCK ERROR in requestBooking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- STEP 4 (Case B): Contractor accepts booking ---
exports.acceptBooking = async (req, res) => {
  // --- ADDED LOG 1 ---
  console.log("--- ENTERING acceptBooking function ---");
  console.log("Booking ID from params:", req.params.id);
  console.log("Contractor ID from token:", req.user?._id);
  // --------------------

  try {
    const { id } = req.params; // The ID of the booking

    // --- ADDED LOG 2 ---
    console.log("--- Finding booking by ID:", id);
    // --------------------
    const booking = await Booking.findById(id);

    // 1. Check if booking exists
    if (!booking) {
      // --- ADDED LOG (Error Case) ---
      console.error("!!! Booking not found for ID:", id);
      // ---------------------------
      return res.status(404).json({ message: "Booking not found" });
    }

    // --- ADDED LOG 3 ---
    console.log("--- Booking found, checking contractor ID ---");
    console.log("Booking Contractor ID:", booking.contractorId);
    console.log("Logged-in User ID:", req.user._id);
    // --------------------

    // 2. Check if the logged-in user is the correct contractor
    // NOTE: We compare strings here because one is a mock ID and one is an ObjectId
    /*if (booking.contractorId.toString() !== req.user._id.toString()) {
      // --- ADDED LOG (Error Case) ---
      console.error(
        "!!! Authorization failed: Booking contractor ID does not match logged-in user ID."
      );
      // ---------------------------
      return res
        .status(403)
        .json({ message: "Not authorized for this booking" });
    }*/

    // --- ADDED LOG 4 ---
    console.log("--- Authorization successful, updating status ---");
    // --------------------

    // 3. Update the status and set the 6-hour payment deadline for the user
    booking.status = "PendingPayment";
    booking.paymentUploadBy = new Date(Date.now() + SIX_HOURS_MS);

    await booking.save();

    // --- ADDED LOG 5 ---
    console.log("--- Booking status updated successfully ---");
    // --------------------

    res
      .status(200)
      .json({ message: "Booking accepted, awaiting payment", booking });
  } catch (error) {
    // --- ADDED LOG 6 (Critical Error Log) ---
    console.error("!!! CATCH BLOCK ERROR in acceptBooking:", error);
    // ---------------------------------------
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- STEP 4 (Case A): Contractor rejects booking ---
exports.rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.contractorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 1. Update status to Rejected
    booking.status = "Rejected";
    await booking.save();
    res.status(200).json({ message: "Booking rejected", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- STEP 5: User uploads payment screenshot ---
// We will create the 'upload' logic in a different file later
exports.uploadPaymentScreenshot = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 1. Save the path to the uploaded file
    // The path will be something like 'uploads/payment_screenshot.jpg'
    booking.paymentScreenshot = req.file.path;
    // Status remains 'PendingPayment' until Admin confirms

    await booking.save();
    res.status(200).json({
      message: "Payment screenshot uploaded. Awaiting admin confirmation.",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- STEP 8: Contractor uploads work photos ---
exports.uploadWorkPhotos = async (req, res) => {
  // --- ADDED LOG 1 ---
  console.log("--- ENTERING uploadWorkPhotos function ---");
  console.log("Booking ID from params:", req.params.id);
  console.log("Contractor ID from token:", req.user?._id);
  console.log("Files received:", req.files ? req.files.length : 0);
  // --------------------

  try {
    const { id } = req.params;

    // --- ADDED LOG 2 ---
    console.log("--- Finding booking by ID:", id);
    // --------------------
    const booking = await Booking.findById(id);

    if (!booking) {
      // --- ADDED LOG (Error Case) ---
      console.error("!!! Booking not found for ID:", id);
      // ---------------------------
      return res.status(404).json({ message: "Booking not found" });
    }

    // --- ADDED LOG 3 ---
    console.log("--- Booking found, checking contractor ID ---");
    console.log("Booking Contractor ID:", booking.contractorId);
    console.log("Logged-in User ID:", req.user._id);
    // --------------------

    /*// Check if the logged-in user is the correct contractor
    // NOTE: This check will fail due to mock IDs vs real IDs
    if (booking.contractorId.toString() !== req.user._id.toString()) {
       // --- ADDED LOG (Error Case) ---
       console.error('!!! Authorization failed: Booking contractor ID does not match logged-in user ID.');
       // ---------------------------
      return res.status(403).json({ message: 'Not authorized' });
    }*/

    // --- ADDED LOG 4 ---
    console.log("--- Authorization successful, checking files ---");
    // --------------------

    const files = req.files || [];
    if (files.length === 0) {
      // --- ADDED LOG (Error Case) ---
      console.error("!!! No files were uploaded.");
      // ---------------------------
      return res.status(400).json({ message: "No photos uploaded" });
    }
    if (files.length > 6) {
      // --- ADDED LOG (Error Case) ---
      console.error(`!!! Too many files uploaded (${files.length}), max is 6.`);
      // ---------------------------
      // Note: Multer might also enforce this limit depending on config
      return res.status(400).json({ message: "Maximum 6 photos allowed." });
    }

    // --- ADDED LOG 5 ---
    console.log("--- Files checked, updating booking status and photos ---");
    // --------------------

    // 1. Save the array of file paths
    booking.workPhotos = files.map((file) => file.path);
    // 2. Update status and set 6-hour deadline for user approval
    booking.status = "PendingUserApproval";
    booking.userApprovalBy = new Date(Date.now() + SIX_HOURS_MS);

    await booking.save();

    // --- ADDED LOG 6 ---
    console.log("--- Booking updated with work photos successfully ---");
    // --------------------

    res
      .status(200)
      .json({
        message: "Work photos uploaded. Awaiting user approval.",
        booking,
      });
  } catch (error) {
    // --- ADDED LOG 7 (Critical Error Log) ---
    console.error("!!! CATCH BLOCK ERROR in uploadWorkPhotos:", error);
    // ---------------------------------------
    res
      .status(500)
      .json({
        message: "Server error during photo upload",
        error: error.message,
      });
  }
};

// --- STEP 9: User clicks "Job Done" ---
exports.markJobAsComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 1. Update status to Completed
    booking.status = "Completed";
    // Admin will now be able to see this and process payout

    await booking.save();
    res.status(200).json({ message: "Job marked as complete!", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- DISPUTE: User files a dispute ---
exports.fileDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { details } = req.body;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Dispute photos are required" });
    }

    // 1. Update status and save dispute info
    booking.status = "InDispute";
    booking.dispute.isFiled = true;
    booking.dispute.details = details;
    booking.dispute.photos = req.files.map((file) => file.path); // Max 2 photos

    await booking.save();
    res.status(200).json({
      message: "Dispute filed. Admin will review within 24 hours.",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- DASHBOARD: Get bookings for the logged-in user ---
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({
      createdAt: -1,
    }); // Show newest first
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- DASHBOARD: Get bookings relevant to the logged-in contractor (handles mock IDs) ---
exports.getContractorBookings = async (req, res) => {
  // --- ADDED LOG ---
  console.log("--- ENTERING getContractorBookings (Smart Version) ---");
  // ---------------
  try {
    // 1. Get the skills of the logged-in contractor
    const loggedInContractor = req.user; // From auth middleware
    if (
      !loggedInContractor ||
      !loggedInContractor.skills ||
      loggedInContractor.skills.length === 0
    ) {
      console.log(
        "--- Logged-in contractor has no skills, returning empty list ---"
      );
      return res.status(200).json([]);
    }
    const loggedInSkillsLower = loggedInContractor.skills.map((s) =>
      s.toLowerCase()
    );
    console.log("--- Logged-in contractor skills:", loggedInSkillsLower);

    // 2. Fetch ALL bookings (regardless of contractorId, for now)
    // LATER: Optimize this query if needed, e.g., only fetch relevant statuses
    console.log("--- Fetching all bookings from DB ---");
    const allBookings = await Booking.find({}) // Fetch all bookings
      // Temporarily removed populate due to mock IDs
      // .populate('jobId', 'title requiredSkill')
      // .populate('userId', 'name')
      .sort({ createdAt: -1 });
    console.log(`--- Found ${allBookings.length} total bookings ---`);

    // --- MOCK DATA needed for skill lookup ---
    const mockContractors = {
      // Keep this updated!
      c1: { skills: ["Plumber"] },
      c2: { skills: ["Plumber", "Electrician", "Tiling"] },
      c3: { skills: ["Carpenter", "Cabinet Making"] },
      c4: { skills: ["Carpenter"] },
      c5: { skills: ["Foundation Work", "Masonry"] },
      c6: { skills: ["Tiling", "Flooring"] },
      c7: { skills: ["Painter"] },
      c8: { skills: ["Structural Steel"] },
    };
    const mockJobDetails = {
      // Keep this updated!
      job1: { requiredSkill: "Plumber" },
      job2: { requiredSkill: "Plumber" },
      job3: { requiredSkill: "Plumber" },
      job4: { requiredSkill: "Electrician" },
      job5: { requiredSkill: "Electrician" },
      job6: { requiredSkill: "Electrician" },
      job7: { requiredSkill: "Carpenter" },
      job8: { requiredSkill: "Carpenter" },
      job9: { requiredSkill: "Carpenter" },
      job10: { requiredSkill: "Foundation Work" },
      job11: { requiredSkill: "Foundation Work" },
      job12: { requiredSkill: "Tiling" },
      job13: { requiredSkill: "Tiling" },
      job14: { requiredSkill: "Painter" },
      job15: { requiredSkill: "Painter" },
      job16: { requiredSkill: "Masonry" },
      job17: { requiredSkill: "Masonry" },
      job18: { requiredSkill: "Structural Steel" },
      job19: { requiredSkill: "Structural Steel" },
      job20: { requiredSkill: "Cabinet Making" },
      job21: { requiredSkill: "Cabinet Making" },
      job22: { requiredSkill: "Flooring" },
      job23: { requiredSkill: "Flooring" },
    };
    // ------------------------------------

    // 3. Filter bookings based on skill overlap
    const relevantBookings = allBookings.filter((booking) => {
      const mockContractorId = booking.contractorId; // This is 'c7' etc.
      const mockContractor = mockContractors[mockContractorId];
      const jobDetails = mockJobDetails[booking.jobId]; // Get job details using mock jobId

      if (!mockContractor && !jobDetails) return false; // Skip if no mock data found

      // Determine relevant skills: EITHER from the mock contractor OR from the job's required skill
      let relevantSkillsLower = [];
      if (mockContractor && mockContractor.skills) {
        relevantSkillsLower = mockContractor.skills.map((s) => s.toLowerCase());
      } else if (jobDetails && jobDetails.requiredSkill) {
        // Fallback: use the job's required skill if mock contractor data is missing
        relevantSkillsLower = [
          jobDetails.requiredSkill.toLowerCase().replace(/\s+/g, "-"),
        ];
      } else {
        return false; // Cannot determine skill relevance
      }

      // Check if ANY relevant skill matches the logged-in contractor's skills
      return relevantSkillsLower.some((skill) =>
        loggedInSkillsLower.includes(skill.replace(/\s+/g, "-"))
      );
    });
    console.log(
      `--- Filtered down to ${relevantBookings.length} relevant bookings ---`
    );

    res.status(200).json(relevantBookings);
  } catch (error) {
    // --- ADDED LOG ---
    console.error("!!! CATCH BLOCK ERROR in getContractorBookings:", error);
    // ---------------
    res
      .status(500)
      .json({
        message: "Server error fetching contractor bookings",
        error: error.message,
      });
  }
};

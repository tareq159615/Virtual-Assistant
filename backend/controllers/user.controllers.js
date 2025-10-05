import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment/moment.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Get current user error: ${error.message}` });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else if (imageUrl) {
      assistantImage = imageUrl;
    } else {
      // যদি কোনো ইমেজ না থাকে, তাহলে existing ইমেজ রাখুন
      const existingUser = await User.findById(req.userId);
      assistantImage = existingUser.assistantImage;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.log("Update assistant error:", error);
    return res
      .status(400)
      .json({ message: "update user error", error: error.message });
  }
};


export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    const userName = "Tareq Aziz";
    const assistantName = user.assistantName;
    const result = await geminiResponse(command, assistantName, userName);
    user.history.push(command)
    user.save()
    // ✨ ADD THIS LINE FOR DEBUGGING
    console.log("Raw response from Gemini:", result);

    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // It's better to return a successful response with an error message
      // than a 400 error, as this is an expected application state.
      return res.status(200).json({ 
        type: "general",
        userInput: command,
        response: result // Send back Gemini's raw text response
      });
    }

    // Wrap the JSON.parse in a try-catch in case jsonMatch is not valid JSON
    let gemResult;
    try {
        gemResult = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
        console.error("JSON Parsing Error:", parseError);
        return res.status(200).json({ 
          type: "general",
          userInput: command,
          response: "I received a response, but couldn't understand the format." 
        });
    }
    
    const type = gemResult.type;

    // ... (rest of your switch statement)
    
    // The rest of your code can remain the same.
    switch (type) {
      // ... your cases
      default:
        // This case now correctly handles unknown command types from Gemini
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });
    }

  } catch (error) {
    console.error("Error in askToAssistant:", error); // Log the full error
    return res.status(500).json({ response: "An internal server error occurred." });
  }
};
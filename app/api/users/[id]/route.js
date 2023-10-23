import { connectToDB } from "@utils/database";

import User from "@models/user";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    console.log("user id: " + params.id);

    const user = await User.findById(params.id);

    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to fetch your user.", {
      status: 500,
    });
  }
};

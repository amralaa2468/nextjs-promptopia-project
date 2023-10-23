"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import Profile from "@components/profile";

const MyProfile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");

  const userId = searchParams.get("id");

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) {
        const response = await fetch(`api/users/${session?.user.id}/posts`, {
          cache: "no-cache",
        });

        const data = await response.json();

        setPosts(data);
      } else {
        const response = await fetch(`api/users/${userId}/posts`, {
          cache: "no-cache",
        });

        const data = await response.json();

        setPosts(data);
      }
    };

    if (session?.user.id || userId) fetchPosts();
  }, [userId]);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`api/users/${userId}`, {
        cache: "no-cache",
      });

      const data = await response.json();

      setUsername(data.username);
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = posts.filter((p) => p._id !== post._id);

        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  let content = (
    <>
      {console.log(posts)}
      {console.log(username)}
      <Profile
        name={!userId ? "My" : username}
        desc={
          !userId
            ? "Welcome to your personalized profile page"
            : `Welcome to ${username}'s profile page`
        }
        data={posts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </>
  );

  return content;
};

export default MyProfile;

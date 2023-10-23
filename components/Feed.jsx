"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    setSearchText(searchText);

    // Filter posts based on search input
    const filtered = posts.filter((post) => {
      const { creator, prompt, tag } = post;

      // Check if any of the fields contain the search text
      return (
        creator.username.toLowerCase().includes(searchText) ||
        prompt.toLowerCase().includes(searchText) ||
        tag.toLowerCase().includes(searchText)
      );
    });

    setFilteredPosts(filtered);
  };

  const handleTagClick = (searchedTag) => {
    setSearchText(searchedTag);

    // Filter posts based on search input
    const filtered = posts.filter((post) => {
      const { tag } = post;

      // Check if any of the fields contain the search text
      return tag.toLowerCase().includes(searchedTag);
    });

    setFilteredPosts(filtered);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("api/prompt");
      const data = await response.json();

      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList
        data={searchText ? filteredPosts : posts}
        handleTagClick={(tag) => {
          handleTagClick(tag);
        }}
      />
    </section>
  );
};

export default Feed;

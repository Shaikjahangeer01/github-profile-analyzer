const axios = require("axios");
const db = require("../config/db");

exports.analyzeProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );

    const user = response.data;

    const sql = `
  INSERT INTO profiles
  (username, name, followers, following, public_repos, profile_url, avatar_url, location, bio)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
  followers = VALUES(followers),
  following = VALUES(following),
  public_repos = VALUES(public_repos),
  location = VALUES(location),
  bio = VALUES(bio)
`;

    db.query(
      sql,
     [
  user.login,
  user.name,
  user.followers,
  user.following,
  user.public_repos,
  user.html_url,
  user.avatar_url,
  user.location,
  user.bio,
],
      (err) => {
        if (err) return res.status(500).json(err);

        res.json({
          message: "Profile analyzed successfully",
          data: user,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "GitHub user not found",
    });
  }
};

exports.getAllProfiles = (req, res) => {
  db.query("SELECT * FROM profiles", (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
};

exports.getSingleProfile = (req, res) => {
  const { username } = req.params;

  db.query(
    "SELECT * FROM profiles WHERE username = ?",
    [username],
    (err, results) => {
      if (err) return res.status(500).json(err);

      res.json(results);
    }
  );
};
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(
				new Error(`Request took too long! Timeout after ${s} second!`)
			);
		}, s * 1000);
	});
};

export const AJAX = async function (url, uploadData = undefined) {
	try {
		const fetchPro = uploadData
			? fetch(url, {
					method: `POST`,
					headers: {
						'Content-Type': `application/json`
					},
					body: JSON.stringify(uploadData)
			  })
			: fetch(url);

		const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
		const data = await res.json();
		if (!res.ok) throw new Error(`${data.message} (${res.status})`);
		return data;
	} catch (err) {
		throw err;
	}
};

// Key: Git Tutorial
/*
git init --> Initializa an empty git repository
git config --global user.name NayeemNishaat --> Set  github Username
git config --global user.email RxNayeemIMI@gmail.com --> Set  github Email
.gitignore --> Put the file/folder names inside this file and these will be ignored by git
git status --> Show the status of the repository
git add -A --> Add all the files/folders to the staging area
git commit -m "Initial Commit" --> Save the modification of all the files to the repository with the message "Initial Commit"
git reset --hard HEAD --> Reset to the previous commit
git log --> Show the log of commits (q --> Quit the git terminal)
git reset --hard b87ad00e650ab0cbe34160f495894f19266a06c4 --> Reset to the commit associated with the ID
git branch --> Shows the list of branch (* --> Means active branch)
git branch new-feature --> Creates a new branch named "new-feature"
git checkout new-feature --> Switch to "new-feature" branch
*/

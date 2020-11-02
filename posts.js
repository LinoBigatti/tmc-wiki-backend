// Post parser

const fs = require('fs');
const dir = './posts';

// ===== POST METADATA ===== //

class PostMetadata {
	constructor() {
		this.id = 0;
		this.title = '';
		this.tags = '';
		this.description = '';
		this.last_edited = new Date().toDateString();
		this.edit_count = 0;
	}
}

const postMetadata = new Map();
let nextPostId = 0;
(() => {
	const metadata = JSON.parse(fs.readFileSync('metadata.json', 'utf8'));
	if (Array.isArray(metadata)) {
		// legacy format
		for (let post of metadata) {
			post.id = +post.id;
			post.edit_count = post.edit_count || 0;
			postMetadata.set(post.id, Object.assign(new PostMetadata(), post));
			if (post.id >= nextPostId) {
				nextPostId = post.id + 1;
			}
		}
	} else {
		nextPostId = metadata.nextPostId;
		for (let post of metadata.posts) {
			postMetadata.set(post.id, Object.assign(new PostMetadata(), post));
		}
	}
})();

const saveMetadata = async () => {
	await fs.writeFile('metadata.json', JSON.stringify({
		nextPostId: nextPostId,
		posts: Array.from(postMetadata.values())
	}), (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log('Metadata saved correctly');
		}
	});
}
exports.saveMetadata = saveMetadata;

const getAllMetadata = () => Array.from(postMetadata.values());
exports.getAllMetadata = getAllMetadata;

const postExists = (postId) => postMetadata.has(postId);
exports.postExists = postExists;

const getMetadata = (postId) => postMetadata.get(postId);
exports.getMetadata = getMetadata;


// ===== POST BODY ===== //

const postBodyCacheLimit = 100;
const postBodyCache = new Map();

const getPostBody = async (postId) => {
	if (postBodyCache.has(postId)) {
		// Move this post ID to the end of the cache
		const body = postBodyCache.get(postId);
		postBodyCache.delete(postId);
		postBodyCache.set(postId, body);
		return body;
	}

	while (postBodyCache.size >= postBodyCacheLimit) {
		postBodyCache.delete(postBodyCache.keys().next().value);
	}

	const body = await fs.promises.readFile(`${dir}/${postId}.json`, 'utf8');

	postBodyCache.set(postId, body);
	return body;
};
exports.getPostBody = getPostBody;

const setPostBody = async (postId, newBody) => {
	if (!postBodyCache.has(postId)) {
		while (postBodyCache.size >= postBodyCacheLimit) {
			postBodyCache.delete(postBodyCache.keys().next().value);
		}
	}

	postBodyCache.set(postId, newBody);
	await fs.writeFile(`${dir}/${postId}.json`, newBody, {encoding: 'utf8'}, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log(`Post ${postId} saved successfully`);
		}
	});
}
exports.setPostBody = setPostBody;


// ===== OTHER ===== //

const createPost = async (title, description, tags, body) => {
	const postId = nextPostId++;
	// save post body before metadata to avoid race condition
	await setPostBody(postId, body);
	const metadata = new PostMetadata();
	metadata.id = postId;
	metadata.title = title;
	metadata.description = description;
	metadata.tags = tags;
	postMetadata.set(postId, metadata);
	await saveMetadata();
	return postMetadata;
}
exports.createPost = createPost;

const getNetworkPostObject = async (postId) => {
	const metadata = getMetadata(postId);
	return {
		id: postId,
		title: metadata.title,
		description: metadata.description,
		tags: metadata.tags,
		last_edited: metadata.last_edited,
		editCount: metadata.edit_count,
		body: await getPostBody(postId)
	};
}
exports.getNetworkPostObject = getNetworkPostObject;

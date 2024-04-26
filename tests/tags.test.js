'use strict';
const TogglClient = require('../');
require('dotenv').config()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Testing Tags', () => {
  let togglClient
  const workspaceId = Number(process.env.WORKSPACE_ID)
  const newTag = {
    name: 'Test tag',
    wid: workspaceId
  }

  beforeEach(() => {
    togglClient = new TogglClient({ apiToken: process.env.API_TOKEN });
  });

  afterEach(() => {
    togglClient.destroy();
  });

  it('should get tags, create it, edit it, create it', async () => {
    async function deleteTag(tagId) {
      await togglClient.deleteTag(workspaceId, tagId)
      await sleep(100)
      const tagsAfterDelete = await togglClient.getTags(workspaceId)
      expect(tagsAfterDelete).toBeInstanceOf(Array);
    }
    async function createTag() {
      const tag = await togglClient.createTag(newTag.wid, newTag.name)
      expect(tag).toHaveProperty('id');
      return tag.id
    }


    const tags = await togglClient.getTags(workspaceId)
    expect(tags).toBeInstanceOf(Array);
    expect(tags[0]).toHaveProperty('id');


    const tagToBeDeleted = tags.find(tag => tag.name === newTag.name)
    if (tagToBeDeleted) {
      await deleteTag(tagToBeDeleted.id)
      await createTag()
    } else {
      const id = await createTag()

      const updatedTag = await togglClient.updateTagName(workspaceId, id, 'Updated tag')
      expect(updatedTag).toHaveProperty('name', 'Updated tag');
      await deleteTag(id)
    }

  })

});


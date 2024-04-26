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

  it('should get tags', async () => {
    const tags = await togglClient.getTags(workspaceId)
    expect(tags).toBeInstanceOf(Array);
    expect(tags[0]).toHaveProperty('id');
  })

  it.only('should create a new tag', async () => {
    const tag = await togglClient.createTag(newTag.name, newTag.wid)
    expect(tag).toHaveProperty('id');
  })

});


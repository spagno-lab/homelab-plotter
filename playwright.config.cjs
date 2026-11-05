const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({testDir:'e2e',fullyParallel:true,timeout:30000,
  use:{headless:true,viewport:{width:1600,height:1050},screenshot:'only-on-failure'},
  reporter:'list',workers:2});

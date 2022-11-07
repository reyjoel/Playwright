import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test('check if we can search', async ({ page }) => {
  await page.goto('https://myflixer.to/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/MyFlixer/);

  // fill input
  const searchBar = page.locator('.search-input');
  await searchBar.fill('Avengers');
  await searchBar.press('Enter');

  // Expects the URL to contain the input search.
  await expect(page).toHaveURL('https://myflixer.to/search/avengers');
});

test('download movies into json file', async ({ page }) => {
  await page.goto('https://myflixer.to/search/avengers');

  await expect(page).toHaveTitle(/Results for 'avengers'/);

  const itemList = page.locator('.flw-item');

  const allMovieList = itemList.filter({ has: page.getByText('Movie')});

  const allMovieListCount = await allMovieList.count();

  const movies: any[] = [];

  if(allMovieListCount){
    for (let i = 0; i < allMovieListCount; i++) {
      movies[i] = await allMovieList.nth(i).innerText();
      movies[i] = movies[i].split("\n");
      movies[i] = movies[i].slice(1, -1);
    }
  }

 await downloadJsonFile(movies);

});

async function downloadJsonFile(movies:object) {
  const jsonContent = JSON.stringify(movies);

  fs.writeFile("./movies.json", jsonContent, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  }); 
}
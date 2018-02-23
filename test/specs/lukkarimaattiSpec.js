/* eslint-env mocha, jquery */
/* global browserBack, click, clickText, expect, getSelectedCoursesFromUrl,
  LukkarimaattiPage, S, setInputValue, testFrame, waitUntil, wait */
describe('Lukkarimaatti UI navigation', () => {
  const page = LukkarimaattiPage()
  before(() => page.openPage(() => {
    const el = testFrame().document.getElementsByClassName('rbc-calendar')
    return el && el.length > 0
  }, ''))

  it('Test link navigation', done => {
    waitUntil(() => $(S('.rbc-calendar')[0]).is(':visible'))()
      .then(click('.header-element', 2))
      .then(() => {
        expect($(S('.department-link-container')[0]).is(':visible')).to.equal(true)
      })
      .then(click('.header-element', 0))
      .then(() => {
        expect($(S('.rbc-calendar')[0]).is(':visible')).to.equal(true)
        done()
      })
  })

  it('Test browser navigation', done => {
    waitUntil(() => $(S('.rbc-calendar')[0]).is(':visible'))()
      .then(click('.header-element', 2))
      .then(() => {
        expect($(S('.department-link-container')[0]).is(':visible')).to.equal(true)
      })
      .then(browserBack())
      .then(waitUntil(() => $(S('.rbc-calendar')[0]).is(':visible')))
      .then(() => {
        expect($(S('.rbc-calendar')[0]).is(':visible')).to.equal(true)
        done()
      })
  })

  it('Test search autocomplete', done => {
    waitUntil(() => $(S('.rbc-calendar')[0]).is(':visible'))()
      .then(setInputValue('#course-searchbox', 0, 'olio-ohjel'))
      .then(waitUntil(() => $(S('.search-list-coursename')[0]).is(':visible')))
      .then(() => {
        expect($(S('.search-list-coursename')).is(':visible')).to.equal(true)
        expect($(S('.search-list-coursename')).text()).to.equal('titeOlio-ohjelmointi')
        done()
      })
  })

  it('Test url params selected courses', done => {
    waitUntil(() => page.openPage(() => {
      const el = testFrame().document.getElementsByClassName('rbc-calendar')
      return el && el.length > 0
    }, 'http://localhost:8080/?courses=BL20A1600+CT60A2411'))()
      .then(waitUntil(() => $(S('.selected-courses-list')[0]).is(':visible')))
      .then(() => {
        const selectedCourses = S('.selected-courses-list .search-list-element').map(e => e.textContent)
        expect(selectedCourses.some(e => e === 'CT60A2411 - Olio-ohjelmointiX')).to.equal(true)
        expect(selectedCourses.some(e => e === 'BL20A1600 - Smart GridsX')).to.equal(true)
        expect(getSelectedCoursesFromUrl()).to.deep.equal(['BL20A1600', 'CT60A2411'])
        done()
      })
  })

  it('Test course removal', done => {
    waitUntil(() => page.openPage(() => {
      const el = testFrame().document.getElementsByClassName('rbc-calendar')
      return el && el.length > 0
    }, 'http://localhost:8080/?courses=BL20A1600+CT60A2411'))()
      .then(click('div:nth-child(3) > div.result-list-remove'))
      .then(waitUntil(() => S('.search-list-element').length === 1))
      .then(click('div:nth-child(2) > div.result-list-remove'))
      .then(waitUntil(() => S('.search-list-element').length === 0))
      .then(() => {
        expect(getSelectedCoursesFromUrl()).to.deep.equal([''])
        expect(S('.result-list-remove').length).to.equal(0)
        done()
      })
  })

  it('Test course selection from catalog', done => {
    waitUntil(() => page.openPage(() => {
      const el = testFrame().document.getElementsByClassName('rbc-calendar')
      return el && el.length > 0
    }, 'http://localhost:8080/?courses=CT60A2411'))()
      .then(click('a#catalogButton'))
      .then(waitUntil(() => S('.department-link-selected').length === 1 && S('.department-course-list').length > 0))
      .then(click('div:nth-child(7) > a.department-link'))
      .then(waitUntil(() => S('div:nth-child(7) > a.department-link-selected').length > 0 &&
        S('.department-course-list').length > 0))
      .then(clickText('li.department-course', /BL20A1600[\w -]+/))
      .then(waitUntil(() => S('.selected').length > 0))
      .then(clickText('a', /Lukkarimaatti\+\+/))
      .then(waitUntil(() => $(S('.rbc-calendar')[0]).is(':visible')))
      .then(() => {
        const selectedCourses = S('.selected-courses-list .search-list-element').map(e => e.textContent)
        expect(selectedCourses.some(e => e === 'CT60A2411 - Olio-ohjelmointiX')).to.equal(true)
        expect(selectedCourses.some(e => e === 'BL20A1600 - Smart GridsX')).to.equal(true)
        expect(getSelectedCoursesFromUrl()).to.deep.equal(['BL20A1600', 'CT60A2411'])
        done()
      })
  })

  it('Test course removal from catalog', done => {
    waitUntil(() => page.openPage(() => {
      const el = testFrame().document.getElementsByClassName('rbc-calendar')
      return el && el.length > 0
    }, 'http://localhost:8080/?courses=BL20A1600+CT60A2411'))()
      .then(click('a#catalogButton'))
      .then(waitUntil(() => S('.department-link-selected').length === 1 && S('.department-course-list').length > 0))
      .then(clickText('li.department-course', /CT60A2411[\w -]+/))
      .then(wait(500))
      .then(click('div:nth-child(7) > a.department-link'))
      .then(waitUntil(() => S('div:nth-child(7) > a.department-link-selected').length > 0 &&
        S('.department-course-list').length > 0))
      .then(clickText('li.department-course', /BL20A1600[\w -]+/))
      .then(wait(500))
      .then(clickText('a', /Lukkarimaatti\+\+/))
      .then(waitUntil(() => $(S('.rbc-calendar')[0]).is(':visible')))
      .then(() => {
        const selectedCourses = S('.selected-courses-list .search-list-element').map(e => e.textContent)
        expect(selectedCourses.some(e => e === 'CT60A2411 - Olio-ohjelmointiX')).to.equal(false)
        expect(selectedCourses.some(e => e === 'BL20A1600 - Smart GridsX')).to.equal(false)
        expect(getSelectedCoursesFromUrl()).to.deep.equal(['http://localhost:8080/'])
        done()
      })
  })
})

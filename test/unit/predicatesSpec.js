/* eslint-env mocha */
import assert from 'assert'
import {isCourseLink, isEmail} from '../../app/utils'

describe('Predicates tests', () => {
  it('Check course link validity', () => {
    assert.equal(isCourseLink('https://lukkarimaatti.ltky.fi/?courses=FV12A1221-F+CT60A0220'), true)
    assert.equal(isCourseLink('https://lukkarimaatti.ltky.fi/?courses=BH60A2101+BH60A3001+BH60A4700+CS20A0002+CS30A0952+CS31A0551+CS34A0732'), true)
    assert.equal(isCourseLink('https://lukkarimaatti.ltky.fi/?courses=LM10A2000(tite)+LM10A3000(tite)+A130A0600+A130A0000+A250A0250+A250A0400+CS10A0010'), true)
    assert.equal(isCourseLink('https://lukkarimaatti.ltky.fi/?courses=0+A130A0350+A250A0250+A250A0750+A250A0800+CT60A0201+LM10A4000%20(kati)+CS10A0010+CS31A0102+BM20A5001+LM10A4000%20(kati)+LM10A4000%20(kati)'), true)
  })

  it('Check invalid course links', () => {
    assert.equal(isCourseLink('https://lukkarimaatti.ltky.fi/?courses='), false)
    assert.equal(isCourseLink('https://lukkarimaatti.ltky.fi/?courses={}'), false)
    assert.equal(isCourseLink('https://lukkarimaatti.ltky.fi/?courses=[]'), false)
    assert.equal(isCourseLink('http://localhost:8080/?courses=CT60A43[]02'), false)
    assert.equal(isCourseLink('http://localhost:8080/?A130A0350'), false)
  })

  it('Check valid email address', () => {
    assert.equal(isEmail('lukkarimaatti@gmail.com'), true)
    assert.equal(isEmail('lukkarimaatti+asd@gmail.com'), true)
    assert.equal(isEmail('jaska.jokunen@lut.fi'), true)
    assert.equal(isEmail('maija.mallikas@student.lut.fi'), true)
  })

  it('Check invalid email address', () => {
    assert.equal(isEmail('@student.lut.fi'), false)
    assert.equal(isEmail('asd@.fi'), false)
    assert.equal(isEmail(), false)
    assert.equal(isEmail(''), false)
  })
})

import { Selector } from 'testcafe';

fixture `HRM Request Entry`
    .page(process.env.BASE_URL + "/request");

test('New HRM Request: New Position', async t => {

    await t
        .typeText(Selector('#username'), 'eversd1')
        .typeText(Selector('#password'), process.env.PASSWORD)
        .click(Selector('#kc-login'))
        .click(Selector('a').withText('Create New Request'))
        .click(Selector('[data-test="requestType"]'))
        .click(Selector('option').withText('New Position'));

    const requestType = await Selector('[data-test="requestType"]');
    await t.expect(await requestType.getAttribute('required')).eql('required', "Request Type should be required.");

    const pcn = await Selector('[data-test="pcn"]');
    await t.expect(await pcn.getAttribute('required')).notEql('required', "PCN should NOT be required.");

    const previousEmployee = await Selector('[data-test="previousEmployee"]');
    await t.expect(await previousEmployee.getAttribute('required')).notEql('required', "Previous Employee should NOT be required.");

    const classification = await Selector('[data-test="classification"]');
    await t.expect(await classification.getAttribute('required')).eql('required', "Proposed Classification should be required.");

    const classOption = await Selector('[data-test="classOption"]');
    await t.expect(await classOption.getAttribute('required')).notEql('required', "Proposed Class should NOT be required.");

    const appointmentType = await Selector('[data-test="appointmentType"]');
    await t.expect(await appointmentType.getAttribute('required')).eql('required', "Appointment Type should be required.");

    const workingTitle = await Selector('[data-test="workingTitle"]');
    await t.expect(await workingTitle.getAttribute('required')).notEql('required', "Working title should NOT be required.");

    const fte = await Selector('[data-test="fte"]');
    await t.expect(await fte.getAttribute('required')).eql('required', "Employment Condition should be required.");

    const location = await Selector('[data-test="location"]');
    await t.expect(await location.getAttribute('required')).eql('required', "Location should be required.");

    const travel = await Selector('[data-test="travel"]');
    await t.expect(await travel.getAttribute('required')).eql('required', "Travel Requirements should be required.");

    const hoursPerWeek = await Selector('[data-test="hoursPerWeek"]');
    await t.expect(await hoursPerWeek.getAttribute('required')).eql('required', "Hours per week should be required.");

    const workingHours = await Selector('[data-test="workingHours"]');
    await t.expect(await workingHours.getAttribute('required')).eql('required', "Working Hours should be required.");

    const schedule = await Selector('[data-test="schedule"]');
    await t.expect(await schedule.getAttribute('required')).eql('required', "Schedule should be required.");

    const startDate = await Selector('[data-test="start-date"]');
    await t.expect(await startDate.getAttribute('required')).eql('required', "Start Date should be required.");

    const division = await Selector('[data-test="division"]');
    await t.expect(await division.getAttribute('required')).eql('required', "Division should be required.");

    const department = await Selector('[data-test="department"]');
    await t.expect(await department.getAttribute('required')).eql('required', "Department should be required.");

    const unit = await Selector('[data-test="unit"]');
    await t.expect(await unit.getAttribute('required')).eql('required', "Unit should be required.");

    
    /*
        .typeText(Selector('[data-test="supervisor"]'), 'd')
        .click(Selector('#autosuggest__results-item--0').sibling().find('div').withText('David J Everson'))
        
        .typeText(Selector('#uid-153-text'), 'posting language')
        .pressKey('tab')
        .typeText(Selector('#uid-157-text'), 'add in')
        .pressKey('tab')
        .typeText(Selector('#uid-165-text'), 'comments')
        .click(Selector('button').withText('Attach Document'))
        .click(Selector('#type-input'))
        .click(Selector('option').withText('Organizational Chart'))
        .click(Selector('#file-input'))
        .setFilesToUpload(Selector('#file-input'), ['raw.csv'])
        .wait(1000)
        .click(Selector('#modal-prevent-closing___BV_modal_body_').find('button').withText('Submit'))
        .wait(1000)

        .click(Selector('button').withText('×'))
        .click(Selector('button').withText('Add additional funding string'))
        .typeText(Selector('#__BVID__231'), '100')
        .pressKey('tab')
        .typeText(Selector('#__BVID__233'), '1')
        .pressKey('tab')
        .typeText(Selector('#__BVID__235'), '1')
        .pressKey('tab')
        .typeText(Selector('#__BVID__237'), '1')
        .pressKey('tab')
        .typeText(Selector('#__BVID__239'), '1')
        .pressKey('tab')
        .typeText(Selector('#__BVID__241'), '1')
        .pressKey('tab')
        .typeText(Selector('#__BVID__243'), '1')
        .pressKey('tab')
        .typeText(Selector('#__BVID__245'), '1')
        .pressKey('tab')
        .typeText(Selector('#__BVID__247'), '1')
        .pressKey('tab')
        .typeText(Selector('#__BVID__249'), '1')
        .pressKey('tab')
        .typeText(Selector('#__BVID__251'), '1')
        .click(Selector('button').withText('Add additional funding string'))
        .typeText(Selector('#__BVID__258'), '23')
        .pressKey('tab')
        .typeText(Selector('#__BVID__260'), '1')
        .pressKey('backspace')
        .typeText(Selector('#__BVID__260'), '2')
        .pressKey('tab')
        .typeText(Selector('#__BVID__262'), '2')
        .pressKey('tab')
        .typeText(Selector('#__BVID__264'), '2')
        .pressKey('tab')
        .typeText(Selector('#__BVID__266'), '2')
        .pressKey('tab')
        .typeText(Selector('#__BVID__268'), '2')
        .pressKey('tab')
        .typeText(Selector('#__BVID__270'), '2')
        .pressKey('tab')
        .typeText(Selector('#__BVID__272'), '2')
        .pressKey('tab')
        .typeText(Selector('#__BVID__274'), '2')
        .pressKey('tab')
        .typeText(Selector('#__BVID__276'), '2')
        .pressKey('tab')
        .typeText(Selector('#__BVID__278'), '2')
        .typeText(Selector('#uid-193-employeeSelector'), 'dave')
        .pressKey('backspace')
        .pressKey('backspace')
        .click(Selector('#autosuggest__results-item--0').find('div').withText('Everson, David J - david.everson@state.mn.us'))
        .typeText(Selector('#uid-197-employeeSelector'), 'pug')
        .click(Selector('strong').withText('Pugh, Joseph'))
        .click(Selector('button').withText('Submit'))
        .click(Selector('a').withText('Log out'));
        */
});
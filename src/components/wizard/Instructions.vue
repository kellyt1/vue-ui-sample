<template>
    <div class="card">
        <div class="card-header" tabindex="0">Instructions</div>
        <div class="card-body">
            <b-row>
                <b-col>
                    MINNESOTA GOVERNMENT DATA PRACTICE ACT NOTICE. This notice is given pursuant to Minnesota Statutes, Sections §13.04, Subd. 2, and §13.41,
                    Subd. 2. The Commissioner of the Minnesota Department of Health (Commissioner) will use information provided in this application to
                    determine if you meet Minnesota Statutes Chapter 146B requirements for licensing. You are not legally required to supply the requested
                    information. However, FAILURE TO PROVIDE INFORMATION OR THE SUBMISSION OF FALSE OR MISLEADING INFORMATION MAY DELAY THE PROCESSING OF
                    YOUR APPLICATION OR MAY BE GROUNDS FOR DENYING YOUR APPLICATION. All data, except your name and address, submitted by you or on your
                    behalf are considered private until you are licensed. "Private" data is data that is not public and is accessible to you. When you
                    become licensed, the application data except social security number becomes public. Information submitted to the Commissioner in this
                    licensing application may, in some circumstances, be disclosed to other persons or entities including the Minnesota Department of Health
                    and its staff, staff of the Attorney General's office; and persons whom they contact including any person to whom the Commissioner must
                    refer the application or parts thereof for verification purposes or for otherwise determining your qualifications, and to persons you
                    designate. In addition, if the matter of your license becomes contested and results in a contested case hearing or litigation, the data
                    submitted by you or on your behalf may also become accessible to the Minnesota Office of Administrative Hearings, appropriate courts,
                    and those associated with such proceedings, and thereby become public data.
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <ul>
                        <li>
                            Read <a href="https://www.revisor.mn.gov/statutes/cite/146B">Minnesota Statutes Chapter 146B Body Art</a>.
                        </li>
                        <li>
                            Complete all questions. If a question does not apply to your situation, mark "N/A".
                        </li>
                        <li>
                            Attach proof that you are at least 18 years old.
                        </li>
                        <li>
                            Attach a copy/copies of the certificates of completion showing course title, presenter and date bloodborne pathogen training was
                            completed. You must successfully complete a course or courses covering these four topics within the past year: bloodborne
                            pathogens, prevention of disease transmission, infection control, and aseptic technique. You must complete five hours of training
                            covering those four topics.
                        </li>
                        <li>
                            Attach a log of 200 hours of supervised experience for tattoo technician license applicants.
                        </li>
                        <li>
                            Attach  a log of 250 piercings under direct supervision and 250 piercings under indirect supervision for piercing technician
                            license applicants.
                        </li>
                        <li>
                            An individual applying for a dual technician license must log 200 hours of tattoo experience and a total of 500 piercings
                            (250 under direct supervision and 250 under indirect supervision).
                        </li>
                        <li>
                            Enclose a notarized <a href="https://www.health.state.mn.us/facilities/providers/bodyart/docs/affidavit.pdf">affidavit</a> signed
                            by your Minnesota licensed supervisor attesting to your logged hours.
                        </li>
                        <li>
                            If you have been licensed or certified in another state or jurisdiction you must request
                            <a href="https://www.health.state.mn.us/facilities/providers/bodyart/docs/vcredfrm.pdf">verification of your credential</a> to be
                            sent to you in a sealed/unopened envelope. Please note that only applicants who have been licensed in another state or
                            jurisdiction are required to include this verification of credential form.
                        </li>
                        <li>
                            You will be required to pay an application fee, either through the online portal or by sending a check or money order with the
                            required application fee, payable to "Treasurer, State of Minnesota".  Please note that the application fee is prorated for the
                            initial application fee. The fee schedule will be available on the last page of the application.
                        </li>
                        <li>
                            Print a copy of this completed application with supporting documents for your records. Do not open sealed envelopes from other states or
                            jurisdictions.
                        </li>
                    </ul>
                </b-col>
            </b-row>
        </div>
    </div>

</template>
<script>
    export default {
        validations() {},
        methods: {
            validate() {
                this.$v.form.$touch();
                var isValid = !this.$v.form.$invalid
                this.$emit('on-validate', this.$data, isValid)
                return isValid
            }
        }
    }
</script>
<style>
    ul li {
        list-style-type: disc;
        display: list-item;
        margin-left: 2em;
    }
</style>
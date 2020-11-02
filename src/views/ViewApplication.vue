<template>

<div id="form-container" ref="formContainer">
    <div v-if="initialPageLoading">
        <div class="text-center">
            <b-spinner variant="primary" label="Text Centered"></b-spinner>
        </div>
    </div>

    <div v-else>
        <h1>HRM Request for {{ request.requestTypeValue.description }}</h1>

        <div class="card">
            <div class="card-header">Request Status</div>
            <div class="card-body">
                <b-row>
                    <b-col>
                        <p><strong>Tracking #</strong></p>
                        <h2>{{request.mdhTrackingId}}</h2>
                        <div v-if="request.jobId" style="font-size:.90em;">
                             {{ request.jobId }}
                        </div>
                        <div>{{ request.requestTypeValue.description }}</div>
                    </b-col>
                    <b-col>
                        <p>Status</p>
                        <h2>{{ request.requestStatusValue.description }}</h2>
                        <span></span>
                    </b-col>
                    <b-col>
                        <div v-if="request.requestStatusValue.code !== '04'">
                             <b-button type="submit" variant="primary"
                                v-if="request.requestStatusValue.code !== '05'
                                    && !needsMyApproval
                                    && !request.completed"
                                @click="putOnHold">Place Request on Hold</b-button>
                            <b-button type="submit" variant="primary"
                                v-if="showCancelButton && !needsMyApproval"
                                @click="cancelRequest">Cancel this Request</b-button>                                
                            <b-button type="submit" variant="primary"
                                v-if="request.requestStatusValue.code === '05'"
                                @click="removeHold">Remove Hold</b-button>
                        
                        </div>

                    </b-col>

                </b-row>
            </div>
        </div>

    <div v-if="needsMyApproval">
        <div class="card">
            <div class="card-header">Your Approval is Required</div>
            <div class="card-body">
                <form-summary :validator="$v.needsMyApproval" ref="errorContainer" id="errorContainer"/>

                <b-form @submit.stop.prevent="onSubmit">
                    <b-row>
                        <b-col cols="12" lg="6">
                            <BaseSelector v-model="needsMyApproval.approvalStatus" 
                                :v="$v.needsMyApproval.approvalStatus"
                                label="Approval Decision"
                                slug="approvalDecision"
                                :options = approvalStatusOptions
                                :required="$v.needsMyApproval.approvalStatus.$params.required" />
                        </b-col>
                        <b-col cols="12" lg="6">
                            <BaseParagraphInput v-model="needsMyApproval.comments"
                                :v="$v.needsMyApproval.comments" 
                                label="Comments"
                                slug="approvalComments"
                                :required="$v.needsMyApproval.comments.$params.required"
                                tip="Summarize in 1000 characters or less the approval decision."/>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-overlay :show="isProcessing" rounded opacity="0.6"
                                       spinner-small spinner-variant="primary"
                                       class="d-inline-block" @hidden="onHidden">
                                <b-button type="submit" variant="primary">
                                    Submit Approval Decision
                                </b-button>
                            </b-overlay>
                        </b-col>
                    </b-row>
                </b-form>
            </div>
        </div>
    </div>

    <div v-if="needsMyICSApproval">
        <div class="card">
            <div class="card-header">Your ICS Approval is Required</div>
            <div class="card-body">
                <form-summary :validator="$v.needsMyICSApproval" ref="errorContainer" id="errorContainer"/>

                <b-form @submit.stop.prevent="onICSApproval">
                    <b-row>
                        <b-col cols="12" lg="6">
                            <BaseSelector v-model="needsMyICSApproval.approvalStatus" 
                                :v="$v.needsMyICSApproval.approvalStatus"
                                label="Approval Decision"
                                slug="approvalDecision"
                                :options = approvalStatusOptions
                                :required="$v.needsMyICSApproval.approvalStatus.$params.required" />
                        </b-col>
                        <b-col cols="12" lg="6">
                            <BaseParagraphInput v-model="needsMyICSApproval.comments"
                                :v="$v.needsMyICSApproval.comments" 
                                label="Comments"
                                slug="approvalComments"
                                :required="$v.needsMyICSApproval.comments.$params.required"
                                tip="Summarize in 1000 characters or less the approval decision."/>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-overlay :show="isProcessing" rounded opacity="0.6"
                                       spinner-small spinner-variant="primary"
                                       class="d-inline-block" @hidden="onHidden">
                                <b-button type="submit" variant="primary">
                                    Submit Approval Decision
                                </b-button>
                            </b-overlay>
                        </b-col>
                    </b-row>
                </b-form>
            </div>
        </div>
    </div>

    <form-summary :validator="$v.request" ref="errorContainer" id="errorContainer"/>

    <b-form>
        <b-row style="margin-bottom:18px;" v-if="!needsMyApproval && !needsMyICSApproval">
            <b-col>
                <b-button type="button" variant="primary" v-if="!isEditing && !request.completed" @click="toggleEdit">Edit Request</b-button>
                <b-button type="button" variant="primary" v-if="isEditing && !request.completed" @click="saveEdits">Update Request</b-button>
                <b-button type="button" variant="outline-primary" v-if="isEditing" @click="toggleEdit">Cancel Editing</b-button>
            </b-col>
        </b-row>

        <div class="card" header-bg-variant="primary" header-text-variant="white"
            v-if="_.includes(['01', '02', '03','04', '05', '06', '07', '08'], request.requestTypeValue.code)">
            <div class="card-header">Position Information</div>
            <div class="card-body">
                <b-row>
                    <b-col cols="12" lg="6">
                        <BaseTextOutput label="Request Type" :value="request.requestTypeValue.description" v-if="!isEditing"/>
                        <BasePositionStatus v-model="request.requestTypeValue" v-if="isEditing"
                                    :v="$v.request.requestTypeValue"
                                    label="Type of Request"
                                    slug="requestType"
                                    tip="What type of request is being submitted. Based on type selected different form options are displayed."/>
                    </b-col>
                </b-row>
                
                <b-row>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Position Control Number" :value="request.positionNumber" v-if="!isEditing"/>
                        <BaseTextInput v-model="request.positionNumber" v-if="isEditing"
                                    :v="$v.request.positionNumber"
                                    label="Position Control Number"
                                    tip="Should be 8 digits. Use leading zeroes as needed. If new/unknown enter 00000000."
                                    v-on:change.native="padPositionNumber"
                                    slug="pcn"
                                    :plaintext=!isEditing
                                    :required="$v.$params.required"/>
                    </b-col>
   
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Previous Incumbent" :value="request.previousIncumbent"/>
                    </b-col>

                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Proposed Classification" :value="request.proposedClassification"/>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Class Option" :value="request.classOption" v-if="!isEditing"/>
                        <BaseTextInput v-model="request.classOption" 
                            v-if="isEditing"
                            :v="$v.request.classOption"
                            slug="classOption"
                            label="Class Option"/>
                    </b-col>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Appointment Type" 
                            :value="_.get(request, 'appointmentValue.description', '')" v-if="!isEditing"/>
                        <BaseSelector v-model="request.appointmentValue.code" v-if="isEditing"
                              :v="$v.request.appointmentValue.code"
                              label="Appointment Type"
                              slug="appointmentType"
                              :options = appointmentTypeOptions />
                    </b-col>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Classified or Unclassified" 
                            :value="_.get(request, 'positionClassificationValue.description', '')" v-if="!isEditing"/>
                        <BaseSelector v-model="request.positionClassificationValue.code" v-if="isEditing"
                              :v="$v.request.positionClassificationValue.code"
                              label="Classified or Unclassified"
                              slug="classifiedType"
                              :options = positionClassificationOptions />
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Working Title" :value="request.workingTitle" v-if="!isEditing"/>
                        <BaseTextInput v-model="request.workingTitle" 
                            v-if="isEditing"
                            :v="$v.request.workingTitle"
                            slug="workingTitle"
                            label="Working Title"/>
                    </b-col>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Employment Condition" v-if="!isEditing"
                            :value="request.positionScheduleValue.description"/>
                        <BaseSelector v-model="request.positionScheduleValue.code"
                            v-if="isEditing" 
                            :v="$v.request.positionScheduleValue.code"
                            label="Employment Condition"
                            :options = positionScheduleOptions />
                    </b-col>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Position Location" :value="request.positionLocation" v-if="!isEditing"/>
                        <BaseLocationSelector v-model="request.positionLocation"  v-if="isEditing"
                                      :v="$v.request.positionLocation"
                                      slug="location"
                                      label="Position Location"/>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Travel Requirement" :value="request.workTravelValue.description" v-if="!isEditing"/>
                        <BaseSelector v-model="request.workTravelValue.code" v-if="isEditing"
                              :v="$v.request.workTravelValue.code"
                              label="Travel Requirement"
                              slug="travel"
                              :options = workTravelOptions />
                    </b-col>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Hours Per Week" :value="request.hoursPerWeek" v-if="!isEditing"/>
                        <BaseTextInput v-model="request.hoursPerWeek" v-if="isEditing"
                                    :v="$v.request.hoursPerWeek"
                                    label="Hours Per Week"
                                    slug="hoursPerWeek"
                                    tip="Hours per week cannot be more than 40"/>
                    </b-col>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Work Hours" :value="request.workingHours" v-if="!isEditing"/>
                        <BaseTextInput v-model="request.workingHours" v-if="isEditing"
                                    :v="$v.request.workingHours"
                                    label="Work Hours"
                                    slug="workingHours"
                                    tip="Example: 8:00 am - 4:30 pm"/>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Work Schedule" :value="request.workScheduleValue.description" v-if="!isEditing"/>
                        <BaseSelector v-model="request.workScheduleValue.code" v-if="isEditing"
                                    :v="$v.request.workScheduleValue.code"
                                    label="Work Schedule"
                                    slug="schedule"
                                    tip=""
                                    :options = workScheduleOptions />
                    </b-col>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Anticipated Start Date" :value="request.anticipatedStartDate"/>
                    </b-col>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="End Date" :value="request.endDate" v-if="!isEditing"/>
                        <b-form-group label="End Date" label-for="end-input" v-if="isEditing">
                            <date-picker id="end-input" v-model="request.endDate"
                                        data-test="end-date"
                                        :config="options">
                            </date-picker>
                            <b-form-text id="end-input-help">Format: YYYY-MM-DD.</b-form-text>
                        </b-form-group>
                    </b-col>
                </b-row>
            </div>
        </div>

        <div class="card" header-bg-variant="primary" header-text-variant="white"
            v-if="_.includes(['09'], request.requestTypeValue.code)">
            <div class="card-header">Redeployment/Re-assignment Information</div>
            <div class="card-body">

                <b-row>
                    <b-col cols="12" lg="6">
                        <BaseTextOutput label="COOP Level" :value="request.coopLevel" v-if="!isEditing"/>
                        <BaseSelector v-model="request.coopLevel" v-if="isEditing"
                            :v="$v.request.coopLevel"
                            label="COOP Level of Position"
                            slug="coop"
                            :options = coopOptions />
                    </b-col>

                    <b-col cols="12" lg="6">
                        <BaseTextOutput label="Employment Condition" :value="request.positionScheduleValue.description" v-if="!isEditing"/>
                         <BaseSelector v-model="request.positionScheduleValue.code" v-if="isEditing"
                            :v="$v.request.positionScheduleValue.code"
                            label="Employment Condition"
                            slug="fte"
                            :options = positionScheduleOptions />
                    </b-col>                
                </b-row>

                <b-row>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Hours Per Week" :value="request.hoursPerWeek" v-if="!isEditing"/>
                        <BaseTextInput v-model="request.hoursPerWeek" v-if="isEditing"
                            :v="$v.request.hoursPerWeek"
                            label="Hours Per Week"
                            slug="hoursPerWeek"
                            tip="Hours per week cannot be more than 40"/>
                    </b-col>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Work Schedule" :value="request.workScheduleValue.description" v-if="!isEditing"/>
                         <BaseSelector v-model="request.workScheduleValue.code" v-if="isEditing"
                            :v="$v.request.workScheduleValue.code"
                            label="Work Schedule"
                            slug="schedule"
                            tip=""
                            :options = workScheduleOptions />
                    </b-col>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Position Location" :value="request.positionLocation" v-if="!isEditing"/>
                        <BaseLocationSelector v-model="request.positionLocation" v-if="isEditing"
                            :v="$v.request.positionLocation"
                            :required="$v.request.positionLocation.$params.required ? true : false"
                            slug="location"
                            label="Position Location"/>
                    </b-col>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Travel Requirement" :value="request.workTravelValue.description" v-if="!isEditing"/>
                        <BaseSelector v-model="request.workTravelValue.code" v-if="isEditing"
                        :v="$v.request.workTravelValue.code"
                        label="Travel Requirement"
                        slug="travel"
                        :options = workTravelOptions />
                    </b-col>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Driver's License Required" :value="request.dlRequired" v-if="!isEditing"/>
                        <BaseSelector v-model="request.dlRequired" v-if="isEditing"
                        :v="$v.request.dlRequired"
                        label="Driver's License Required"
                        slug="dlrequired"
                        :options = yesNoOptions />
                    </b-col>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Telework Available" :value="request.teleworkAvailable" v-if="!isEditing"/>
                        <BaseSelector v-model="request.teleworkAvailable" v-if="isEditing"
                        :v="$v.request.teleworkAvailable"
                        label="Telework Available"
                        slug="telework"
                        :options = yesNoUnknownOptions />
                    </b-col>
                </b-row>
                
                <b-row>
                    <b-col cols="12" lg="4">                
                        <BaseTextOutput label="Anticipated Start Date" :value="request.anticipatedStartDate"/>                          
                    </b-col>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="End Date" :value="request.endDate"/>
                    </b-col>
                </b-row>
            </div>
        </div>

        <div class="card" header-bg-variant="primary" header-text-variant="white"
            v-if="_.includes(['10'], request.requestTypeValue.code)">
            <div class="card-header">Leave Request</div>
            <div class="card-body">

                <b-row>
                    <b-col cols="12" lg="12">
                        <div v-if="!isEditing">
                            <b-row>
                                <b-col cols="12" lg="4">
                                    <BaseTextOutput label="Employee Name" :value="request.employee.name"/>
                                </b-col>
                                <b-col cols="12" lg="4">
                                    <BaseTextOutput label="Employee Email" :value="request.employee.email"/>
                                </b-col>
                                <b-col cols="12" lg="4">
                                    <BaseTextOutput label="Employee Id" :value="request.employee.employeeId"/>
                                </b-col>
                            </b-row>
                        </div>
                        <BaseEmployeeSelector v-model="request.employee" v-if="isEditing"
                            label="Employee"
                            :v="$v.request.employee"
                            slug="employee"
                            tip=""
                            :showPcn="true"/>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Leave Type" :value="request.leaveType" v-if="!isEditing"/>
                         <BaseSelector v-model="request.leaveType" v-if="isEditing"
                            :v="$v.request.leaveType"
                            label="Leave Type"
                            slug="leaveType"
                            :options = leaveTypeOptions />
                    </b-col>    
                     <b-col cols="12" lg="4">
                        <BaseTextOutput label="Work Status" :value="request.workStatus" v-if="!isEditing"/>
                        <BaseSelector v-model="request.workStatus" v-if="isEditing"
                            :v="$v.request.workStatus"
                            label="Work Status"
                            slug="workStatus"
                            :options = workStatusOptions />
                    </b-col> 
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Leave Decision" :value="request.leaveDecision" v-if="!isEditing"/>
                        <BaseSelector v-model="request.leaveDecision" v-if="isEditing"
                            :v="$v.request.leaveDecision"
                            label="Leave Decision"
                            slug="leaveDecision"
                            :options = leaveDecisionOptions />
                    </b-col>               
                </b-row>
                
                <b-row>
                    <b-col cols="12" lg="4">       
                        <BaseTextOutput label="Anticipated Start Date" :value="request.anticipatedStartDate"
                            v-if="!isEditing"/>           
                        <BaseDateInput v-model="request.anticipatedStartDate" v-if="isEditing"
                            :v="$v.request.anticipatedStartDate"
                            label="Anticipated Start Date"
                            slug="start-date"/>
                    </b-col>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="End Date" :value="request.endDate" v-if="!isEditing"/>
                        <BaseDateInput v-model="request.endDate" v-if="isEditing"
                            :v="$v.request.endDate"
                            label="Anticipated End Date"
                            slug="end-date"/>
                    </b-col>                    
                </b-row>

                <b-row>
                    <b-col cols="12" lg="4">       
                        <BaseTextOutput label="Type of COVID Leave" :value="request.typeOfCovidLeave"
                            v-if="!isEditing"/>
                        <BaseSelector v-model="request.typeOfCovidLeave" v-if="isEditing"
                            :v="$v.request.typeOfCovidLeave"
                            label="Type of COVID Leave"
                            slug="covidLeave"
                            :options = covidLeaveTypeOptions />
                    </b-col>    
                    <b-col cols="12" lg="4">       
                        <BaseTextOutput label="Work Restrictions" :value="request.workRestrictions"
                            v-if="!isEditing"/>
                        <BaseSelector v-model="request.workRestrictions" v-if="isEditing"
                            :v="$v.request.workRestrictions"
                            label="Work Restrictions"
                            slug="workRestrictions"
                            :options = workRestrictionOptions />
                    </b-col>   
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Additional Authorization Needed" :value="request.addlAuthNeeded" v-if="!isEditing"/>
                        <BaseSelector v-model="request.addlAuthNeeded" v-if="isEditing"
                            :v="$v.request.addlAuthNeeded"
                            label="Additional Authorization Needed"
                            slug="addlAuthNeeded"
                            :options = leaveDecisionOptions />
                    </b-col>                  
                </b-row>

                <b-row v-if="isEditing">
                    <b-col cols="12" v-if="request.requestStatusValue.code === '02'">
                         <BaseSwitchInput v-model="request.isLeaveRequestComplete"
                                :v="$v.request.isLeaveRequestComplete"
                                label="Is Leave Request Complete?"
                                :disabled="isLeaveRequestComplete"
                                tip=""/>
                    </b-col>
                </b-row>

                <b-row v-if="isEditing">
                    <b-col cols="12" v-if="request.requestStatusValue.code === '21'">
                         <BaseSwitchInput v-model="request.isLeaveRequestClosed"
                                :v="$v.request.isLeaveRequestClosed"
                                label="Is Leave Request Closed?"
                                :disabled="isLeaveRequestClosed"
                                tip=""/>
                    </b-col>
                </b-row>
            </div>
        </div>

        <div class="card" header-bg-variant="primary" header-text-variant="white">
            <div class="card-header">Organizational Information</div>
            <div class="card-body">
                <b-row>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Division" :value="request.division"/>
                    </b-col>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Department ID" :value="request.departmentId" v-if="!isEditing"/>
                        <BaseDepartmentSelector v-model="request.departmentId" v-if="isEditing"
                                        :v="$v.request.departmentId"
                                        slug="department"
                                        label="Department ID"/>
                    </b-col>
                    <b-col cols="12" lg="4">
                        <BaseTextOutput label="Unit Name" :value="request.unitName"/>
                    </b-col>
                </b-row>
            </div>
        </div>

        <div class="card" header-bg-variant="primary" header-text-variant="white"
            v-if="_.includes(['01', '02', '03','04', '05', '06', '07', '08', '10'], request.requestTypeValue.code)">
            <div class="card-header">Supervisor</div>
            <div class="card-body">

            <b-row v-if="!isEditing">
                <b-col cols="12" lg="3">
                    <BaseTextOutput label="Name" :value="request.supervisor.name"/>
                </b-col>
                <b-col cols="12" lg="3">
                    <BaseTextOutput label="Email" :value="request.supervisor.email"/>
                </b-col>
                <b-col cols="12" lg="3">
                    <BaseTextOutput label="Phone #" :value="request.supervisor.phoneNbr"/>
                </b-col>
                <b-col cols="12" lg="3">
                    <BaseTextOutput label="PCN" :value="request.supervisor.pcn"/>
                </b-col>
            </b-row>
            <b-row v-if="isEditing">
                <b-col cols="12">
                    <BaseEmployeeSelector v-model="request.supervisor" v-if="isEditing"
                                        label="Supervisor"
                                        :v="$v.request.supervisor"
                                        slug="supervisor"
                                        tip="Type the email address of the supervisor. Select 'Vacant' for none."/>
                </b-col>
            </b-row>
        </div>
    </div>

    <div class="card" header-bg-variant="primary" header-text-variant="white"
        v-if="!_.includes(['10'], request.requestTypeValue.code)">
        <div class="card-header">Position Requirements</div>
        <div class="card-body">
            <b-row>
                <b-col>
                    <BaseTextOutput label="Posting Language" :value="request.postingLanguage" 
                        v-if="!isEditing && _.includes(['01', '02', '03','04', '05', '06', '07', '08', '09'], request.requestTypeValue.code)"/>
                    <BaseParagraphInput v-model="request.postingLanguage" 
                        v-if="isEditing && _.includes(['01', '02', '03','04', '05', '06', '07', '08', '09'], request.requestTypeValue.code)"
                        :v="$v.request.postingLanguage"
                        label="Posting Language"
                        slug="postingLanguage"
                        tip=""/>
                </b-col>
            </b-row>

            <b-row>
                <b-col>
                    <BaseTextOutput label="Perferred Qualifications" :value="request.perferredQualifications"
                        v-if="_.includes(['01', '02', '03','04', '05', '06', '07', '08'], request.requestTypeValue.code)"/>
                </b-col>
            </b-row>

            <b-row>
                <b-col>
                    <BaseTextOutput label="Minimum Qualifications" :value="request.minQualifications"
                        v-if="!isEditing && _.includes(['01', '02', '03','04', '05', '06', '07', '08', '09'], request.requestTypeValue.code)"/>
                    <BaseParagraphInput v-model="request.minQualifications"
                        v-if="isEditing && _.includes(['01', '02', '03','04', '05', '06', '07', '08', '09'], request.requestTypeValue.code)"
                        :v="$v.request.minQualifications"
                        label="Minimum Qualifications"
                        slug="minQuals"
                        tip=""/>
                </b-col>
            </b-row>

            <b-row>
                <b-col>
                    <BaseTextOutput label="Physical Requirements" :value="request.physicalRequirements"
                        v-if="_.includes(['01', '02', '03','04', '05', '06', '07', '08'], request.requestTypeValue.code)"/>
                </b-col>
            </b-row>    

            <b-row>
                <b-col>
                    <BaseTextOutput label="Software Experience Needed" :value="request.softwareExpNeeded"
                        v-if="!isEditing && _.includes(['09'], request.requestTypeValue.code)"/>
                    <BaseParagraphInput v-model="request.softwareExpNeeded"
                        v-if="isEditing && _.includes(['09'], request.requestTypeValue.code)"
                        :v="$v.request.softwareExpNeeded" 
                        label="Software Experience Needed"
                        slug="softwareExpNeeded"
                        tip=""/>
                </b-col>
            </b-row>       
            <b-row>
                <b-col>
                    <BaseTextOutput label="Required Licenses/Certifications" :value="request.licCredsRequired"
                        v-if="!isEditing && _.includes(['09'], request.requestTypeValue.code)"/>
                    <BaseParagraphInput v-model="request.licCredsRequired"
                        v-if="isEditing && _.includes(['09'], request.requestTypeValue.code)"
                        :v="$v.request.licCredsRequired" 
                        label="Required Licenses/Certifications"
                        slug="licCredsRequired"
                        tip=""/>
                </b-col>
            </b-row>       
            <b-row>
                <b-col>
                    <BaseTextOutput label="Specific Staff Requested" :value="request.specificStaffRequested"
                        v-if="_.includes(['09'], request.requestTypeValue.code)"/>
                </b-col>
            </b-row>    
        </div>
    </div>

    <div class="card" header-bg-variant="primary" header-text-variant="white">
        <div class="card-header">Request Comments</div>
        <div class="card-body">
            <b-row>
                <b-col>
                    <BaseTextOutput label="Comments" :value="request.comments"/>
                </b-col>
            </b-row>            
        </div>
    </div>
        
    <div class="card" header-bg-variant="primary" header-text-variant="white">
        <div class="card-header">Attachments</div>
        <div class="card-body">
            <b-row>
                <b-col>            
                    <b-table hover small show-empty
                        responsive="true"
                        :fields="attachmentFields"
                        :items="request.attachments"
                        :busy="false">      
                        <template v-slot:no-data>
                            No Attachments Found.
                        </template>
                        <div slot="table-busy" class="text-center text-danger my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>Loading...</strong>
                        </div>  
                        <template v-slot:cell(actions)="row">
                            <b-button size="sm" :href="row.item.url" target="_attach" class="mr-1">
                                download
                            </b-button>
                        </template>
                        <template slot="empty" slot-scope="scope">
                            No Attachments Found.
                        </template>
                    </b-table>
                </b-col>
            </b-row>
        </div>
    </div>

    <div class="card" header-bg-variant="primary" header-text-variant="white"
             v-if="!_.includes(['10'], request.requestTypeValue.code)">
        <div class="card-header">Finance Information</div>
        <div class="card-body">
            <b-row>
                <b-col>
                    <b-table-simple id="fundingStrs" hover small caption-top responsive>
                        <b-thead>
                            <b-tr>
                                <b-th>Percent</b-th>
                                <b-th>Fund</b-th>
                                <b-th>Fin Dept ID</b-th>
                                <b-th>Approp ID</b-th>
                                <b-th>SW Cost</b-th>
                                <b-th>Sub Acct</b-th>
                                <b-th>Agcy Cost 1</b-th>
                                <b-th>Agcy Cost 2</b-th>
                                <b-th>Project</b-th>
                                <b-th>Activity</b-th>
                                <b-th>Source</b-th>
                            </b-tr>
                        </b-thead>
                        <b-tbody>
                            <b-tr v-for="(item, index) in request.funding" :key="index">
                                <b-td>{{item.fundingPercent}}</b-td>
                                <b-td>{{item.fundId}}</b-td>
                                <b-td>{{item.divisionId}}</b-td>
                                <b-td>{{item.appropriationId}}</b-td>
                                <b-td>{{item.swCost}}</b-td>
                                <b-td>{{item.subAccount}}</b-td>
                                <b-td>{{item.agcyCost1}}</b-td>
                                <b-td>{{item.agcyCost2}}</b-td>
                                <b-td>{{item.project}}</b-td>
                                <b-td>{{item.activity}}</b-td>
                                <b-td>{{item.sourceType}}</b-td>
                            </b-tr>
                        </b-tbody>
                    </b-table-simple>
                </b-col>
            </b-row>
        </div>
    </div>

    <div class="card" header-bg-variant="primary" header-text-variant="white">
        <div class="card-header">Request Approvals</div>
        <div class="card-body">
        <b-row v-for="approver in request.approvals" :key="approver.approvalStatusDatetime">
            <b-col>
                <BaseTextOutput label="Role" :value="approver.approvalType"/>
            </b-col>
            <b-col>
                <BaseTextOutput label="Outcome" :value="approver.approvalStatus"/>
            </b-col>
            <b-col>
                <BaseTextOutput label="Date" :value="approver.approvalStatusDatetime"/>
            </b-col>
            <b-col>
                <BaseTextOutput label="Approver" :value="approver.approver.name"/>
            </b-col>
        </b-row>
        <!--
        <b-row>
            <b-col>
                <BaseEmployeeSelector v-model="divDirector.approver"
                    label="Divison Director"
                    :v="$v.divDirector.approver"
                    tip=""/>
            </b-col>
            <b-col>
                <BaseEmployeeSelector v-model="asstCommissioner.approver"
                    label="Assistant Commissioner"
                    :v="$v.asstCommissioner.approver"
                    tip=""/>
            </b-col>
        </b-row>
        -->
        </div>
        </div>

    <LifecycleHistory :requestId="request.id"/>

    </b-form>
    </div>

</div>
</template>

<script>
import axios from "axios"
import _ from "lodash"
import { required, email, minLength, maxLength, numeric, requiredUnless, requiredIf } from 'vuelidate/lib/validators'
import { commonOptions } from '@/mixins/commonOptions.js'
import datePicker from 'vue-bootstrap-datetimepicker';

export default {
    data() {
        return {
            request: { },
            initialPageLoading: true,
            isAssignedLifecycle: false,
            isUnassigned: false,
            isAuditLifecycle: false,
            isDraftPosting: false,
            isPosted: false,
            isReposted: false,
            isScreening: false,
            isManagerInterviewing: false,
            isSalaryReview: false,
            isPreOffer: false,
            isOffer: false,
            isBackgroundCheck: false,
            isComplete: false,
            isRDCSubmission: false,
            isRDCCandidate: false,
            isRDCOnboard: false,
            isOnHold: false,
            isEditing: false,
            isProcessing: false,
            transitionStatus: null,
            isReadyForCFOReview: false,
            approvalStatusOptions: [
                { value: 'P', text: 'Pending' },
                { value: 'A', text: 'Approved' },    
                { value: 'R', text: 'Rejected' },    
            ],
            transitionLifeCycleOptions: [
                { value: '06', text: 'Start Audit' },
                { value: '07', text: 'Start Draft Posting to Hiring Supervisor' },
                { value: '08', text: 'Posted'},
                { value: '09', text: 'Screen Applicants'},
            ],
            attachmentFields:  [
                {key: 'filename', sortable: true, label: 'File Name'},
                {key: 'type', sortable: true, label: 'File Type', formatter: 'getFileType'},
                {key: 'actions', label: 'Actions'}
            ],
            options: {
                format: 'YYYY-MM-DD',
                useCurrent: false,
            },
            needsMyICSApproval: {},
            defaultRequestAttributes: {
                positionClassificationValue: {
                    code: '',
                    description: ''
                },
                appointmentValue: {
                    code: '',
                    description: ''
                },
                workScheduleValue: {
                    code: '',
                    description: ''
                },
            },
        }
    },
mixins: [
       commonOptions
    ],    
    
    components: {
        datePicker,
    },

     validations: {
        transitionStatus: {  },
        
        needsMyApproval: {
            approvalStatus: { required },
            comments: { required: false, maxLength: maxLength(1000) }
        },

        needsMyICSApproval: {
            approvalStatus: { required },
            comments: { required: false, maxLength: maxLength(1000) }
        },

        request: {              
            positionNumber: { 
                required: requiredIf(function() {
                    return _.includes(['02', '03', '04', '05', '06', '07', '08'], this.request.requestTypeValue.code)
                }),
                maxLength: maxLength(8) 
            },
            
            proposedClassification: { 
                required: requiredIf(function() {
                    return _.includes(['01', '02', '03', '04', '05', '06', '07', '08'], this.request.requestTypeValue.code)
                }) 
            },
            
            previousIncumbent: { 
                required: false, 
                maxLength: maxLength(50) 
            },

            classOption: { 
                required: false, 
                maxLength: maxLength(50) 
            },
            
            workingTitle: { 
                required: false, 
                maxLength: maxLength(50) 
            },
            
            positionLocation: { 
                required: requiredIf(function() {
                    return _.includes(['01', '02', '08', '09'], this.request.requestTypeValue.code)
                }),
                maxLength: maxLength(50),
            },

            hoursPerWeek: { 
                required: requiredIf(function() {
                    return _.includes(['01', '02', '08', '09'], this.request.requestTypeValue.code)
                }),
                numeric
            },
            
            workingHours: { 
                required: requiredIf(function() {
                    return _.includes(['01', '02', '08'], this.request.requestTypeValue.code)
                }),
                maxLength: maxLength(50)
            },
             
            division: { 
                required: requiredIf(function() {
                    return _.includes(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'], this.request.requestTypeValue.code)
                }),                
            },

            departmentId: { 
                required: requiredIf(function() {
                    return _.includes(['01', '02', '03', '04', '05', '06', '07', '08'], this.request.requestTypeValue.code)
                }),
            },

            unitName: { 
                required: false 
            },

            postingLanguage: { 
                required: requiredIf(function() {
                    return _.includes(['01', '02', '08', '09'], this.request.requestTypeValue.code)
                }),
                maxLength: maxLength(1000)
            },

            supervisor: {
                userId: { 
                    required: requiredIf(function() {
                        return _.includes(['01', '02', '03', '04', '05', '06', '07', '08', '10'], this.request.requestTypeValue.code)
                    }),
                }
            }, 

            employee: {
                userId: { 
                    required: requiredIf(function() {
                        return _.includes(['10'], this.request.requestTypeValue.code)
                    }),
                }
            }, 

            leaveType: { 
                required: requiredIf(function() {
                    return _.includes(['10'], this.request.requestTypeValue.code)
                })
            },

            workStatus: { 
                required: requiredIf(function() {
                    return _.includes(['10'], this.request.requestTypeValue.code)
                })
            },

            
            leaveDecision: { 
                required: requiredIf(function() {
                    return _.includes(['10'], this.request.requestTypeValue.code)
                })
            },

            perferredQualifications: { 
                required: false,
                maxLength: maxLength(1000) 
            },
        
            minQualifications: { 
                required: requiredIf(function() {
                    return _.includes(['01', '02', '08', '09'], this.request.requestTypeValue.code)
                }),
                maxLength: maxLength(1000),
            },

            physicalRequirements: { 
                required: false, 
                maxLength: maxLength(1000) 
            },
        
            comments: { 
                required: false, 
                maxLength: maxLength(1000) 
            },

            requestTypeValue: {
                code: { 
                    required: true 
                }
            },
            
            positionScheduleValue: {
                code: { 
                    required: requiredIf(function() {
                        return _.includes(['01', '02', '08', '09'], this.request.requestTypeValue.code)
                    })
                }
            },

            appointmentValue: {
                code: { 
                    required: requiredIf(function() {
                        return _.includes(['01', '02', '03', '04', '05', '06', '08'], this.request.requestTypeValue.code)
                    })
                }
            },

            workScheduleValue: {
                code: { 
                    required: requiredIf(function() {
                        return _.includes(['09'], this.request.requestTypeValue.code)
                    })
                }
            },

            workTravelValue: {
                code: {  
                    required: requiredIf(function() {
                        return _.includes(['01', '02', '08', '09'], this.request.requestTypeValue.code)
                    }) 
                }
            },
            
            anticipatedStartDate: { 
                required: requiredIf(function() {
                    return _.includes(['01', '02', '08', '09', '10'], this.request.requestTypeValue.code)
                })
            },

            endDate: { 
                required: requiredIf(function() {
                    return _.includes(['07', '09', '10'], this.request.requestTypeValue.code)
                })
            },
            typeOfCovidLeave: { 
                required: false, 
                maxLength: maxLength(15)
            },
            workRestrictions: { 
                required: false, 
                maxLength: maxLength(15)
            },
            addlAuthNeeded: {
                required: false, 
                maxLength: maxLength(15)
            },
            funding: {
                required: requiredUnless(function() {
                    return _.includes(['10'], this.request.requestTypeValue.code)
                }),
                minLength: minLength(1),
                $each: {
                    fundingPercent: {
                        required,
                        numeric
                    },
                    fundId: {
                        required,
                    },
                    divisionId: {
                        required,
                    },
                    sourceType: {
                        required,
                    },
                    appropriationId: {
                        required,
                    },
                    project: {
                        required: requiredIf(function(item) {
                            return item.fundId === '3000' || item.fundId === '3001'
                        })
                    },
                    activity: {
                        required: requiredIf(function(item) {
                            return item.project
                        })
                    }
                }
            },

            coopLevel: {
                required: requiredIf(function() {
                    return _.includes(['09'], this.request.requestTypeValue.code)
                })
            },

            dlRequired: {
                required: requiredIf(function() {
                    return _.includes(['09'], this.request.requestTypeValue.code)
                })
            },

            teleworkAvailable: {
                required: requiredIf(function() {
                    return _.includes(['09'], this.request.requestTypeValue.code)
                }),
                maxLength: maxLength(1000) 
            },

            softwareExpNeeded: {
                required: false,
                maxLength: maxLength(1000)
            },

            licCredsRequired: {
                required: requiredIf(function() {
                    return _.includes(['09'], this.request.requestTypeValue.code)
                }),
                maxLength: maxLength(1000)
            }, 

            specificStaffRequested: {
                required: false,
                maxLength: maxLength(1000)
            }, 
            isLeaveRequestComplete: { required: false },
            isLeaveRequestClosed: { required: false },
        },
     },

     computed: {
        _: function() {
            return _
        },
       showCancelButton: function() {
           return _.some(['09', '10', '11', '12', '13', '16'], 
                        _.matches(this.request.requestStatusValue.code))
       },
       hasCFORole() {
           return this.$store.state.userRole.hasCFORole
       }
     },

    watch: {
        request() {    
            this.isUnassigned = this.request.requestStatusValue.code === '02' &&
                !this.request.assigned.userId && 
                !this.request.requestTypeValue.code === '09'

            this.isReadyForCFOReview = this.request.requestStatusValue.code === '02' && 
                this.request.requestTypeValue.code === '09' &&
                this.hasCFORole

            this.isOnHold = this.request.requestStatusValue.code === '05'
            this.isAssignedLifecycle = this.request.requestStatusValue.code === '04'
            this.isAuditLifecycle = this.request.requestStatusValue.code === '06'
            this.isDraftPosting = this.request.requestStatusValue.code === '07'
            this.isPosted = this.request.requestStatusValue.code === '08'
            this.isReposted = this.request.requestStatusValue.code === '14'
            this.isScreening = this.request.requestStatusValue.code === '09'
            this.isManagerInterviewing = this.request.requestStatusValue.code === '10'
            this.isPreOffer = this.request.requestStatusValue.code === '16'
            this.isSalaryReview = this.request.requestStatusValue.code === '11'
            this.isOffer = this.request.requestStatusValue.code === '12'
            this.isBackgroundCheck = this.request.requestStatusValue.code === '13'
            this.isComplete = this.request.requestStatusValue.code === '15'
            this.isRDCSubmission = this.request.requestStatusValue.code === '18' &&
                    this.$store.state.userRole.hasICSHRMRole
            this.isRDCCandidate = this.request.requestStatusValue.code === '19' &&
                    this.$store.state.userRole.hasICSHRMRole
            this.isRDCOnboard = this.request.requestStatusValue.code === '20' &&
                    this.$store.state.userRole.hasICSHRMRole
        },
        transitionStatus() {
            this.transitionRequest()
        }
    },
    
    created() {
        this.requestId = this.$route.params.id
        this.fetchRequest()
    },
    
    methods: {
        padPositionNumber() {
            this.request.positionNumber = String(this.request.positionNumber).padStart(8, '0')
        },
        fetchRequest() {
            console.log(`fetching request: ${this.requestId}`)
            this.needsMyApproval = false
            this.needsMyICSApproval = false
            axios.get(`${process.env.VUE_APP_API_BASE_URL}/request/${this.requestId}`)
                .then(response => { 
                    this.initialPageLoading = false
                    this.request = _.merge(this.defaultRequestAttributes, response.data)

                    this.needsMyApproval =  this.request.approvals.find(a => a.approvalStatus === 'P'
                        && (a.approver.userId.toLowerCase() === 'EVERSD1'.toLowerCase()
                        || a.approver.userId.toLowerCase() === 'FM-TODO'.toLowerCase()))
                    
                    if (this.request.requestTypeValue.code === '09' && this.request.requestStatusValue.code === '01') {
                        this.checkForICSApproval()
                    }
                })
        },
        checkForICSApproval() {
            console.log("checking role")
            this.needsMyICSApproval = false
            axios.get(`${process.env.VUE_APP_API_BASE_URL}/request/hasrole/ics`)
                .then(response => { 
                    console.log(response.data)
                    if (response.data === true) {
                        this.needsMyICSApproval = {
                            id: this.request.id,
                            approvalStatus: '',
                            comments: '',
                        }
                        console.log("setting needs my ics approval")
                    }
                })
        },
        onSubmit() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                           this.$nextTick(() => {
                document.getElementById('form-container').scrollIntoView()
                          })
                return
            }
            this.isProcessing = true
            axios.post(`${process.env.VUE_APP_API_BASE_URL}/request/approval`,
                    this.needsMyApproval)
                  .then(response => { 
                      this.isProcessing = false
                     this.showRootToast("Approval Decision Updated", "Your approval decision has been recorded.", "success")
                     this.$router.push('/home')
                      })
        },

        onICSApproval() {
            this.$v.needsMyICSApproval.$touch();
            if (this.$v.needsMyICSApproval.$invalid) {
                           this.$nextTick(() => {
                document.getElementById('form-container').scrollIntoView()
                          })
                return
            }
            this.isProcessing = true
            axios.post(`${process.env.VUE_APP_API_BASE_URL}/request/icsapproval`,
                    this.needsMyICSApproval)
                  .then(response => { 
                      this.isProcessing = false
                     this.showRootToast("Approval Decision Updated", "Your ICS approval decision has been recorded.", "success")
                     this.$router.push('/home')
                      })
        },
        putOnHold() {
            axios.post(`${process.env.VUE_APP_API_BASE_URL}/request/transition`,
                    {
                        id: this.request.id,
                        transitionStatusTo: '05'
                    })
                  .then(response => { 
                  this.request = response.data
                  
                    this.showToast("Request Phase Updated", "This request has been put on hold.", "success") })
        },
        removeHold() {
            axios.post(`${process.env.VUE_APP_API_BASE_URL}/request/removeHold`,
                    {
                        requestId: this.request.id
                    })
                  .then(response => {
                    this.request = response.data
                    this.showToast("Request Phase Updated", "The hold has been removed.", "success")
                     })
        },
        cancelRequest() {
             let payload = {
                id: this.request.id,
                transitionStatusTo: '17'
            }

            axios.post(`${process.env.VUE_APP_API_BASE_URL}/request/transition`, payload)
                  .then(response => { 
                    this.showRootToast("Request Cancelled", 
                        "The reqeust has been cancelled.", "success")
                     this.$router.push('/home')
                  })                  

        },
        showToast(title, message, type) {
            this.$bvToast.toast(message, {
                  title: title,
                  toaster: 'b-toaster-top-center',
                  solid: true,
                  variant: type,
                  appendToast: true
                })

        },
        showRootToast(title, message, type) {
            this.$root.$bvToast.toast(message, {
                  title: title,
                  toaster: 'b-toaster-top-center',
                  solid: true,
                  variant: type,
                  appendToast: true
                })

        },
        transitionRequest() {
            axios.post(`${process.env.VUE_APP_API_BASE_URL}/request/transition`,
                    {
                        id: this.request.id,
                        transitionStatusTo: this.transitionStatus
                    })
                  .then(response => { 
                  this.request = response.data })
        },
        getFileType(value) {
            switch (value) {
                case '1': return 'Memo'
                case '2': return 'Position Description'
                case '3': return 'Organizational Chart'
                case '4': return 'Old Position Description'
                case '5': return 'Performance Review'
                case '6': return 'Interview Questions'
                case '7': return 'Other'
                default: return 'Unknown'
            }
        },
        toggleEdit() {
            this.isEditing = !this.isEditing
        },

        saveEdits() {
             axios.put(`${process.env.VUE_APP_API_BASE_URL}/request`, this.request)
                  .then(response => { 
                    this.showRootToast("Request Updated", "Your changes were applied.", "success")
                    this.fetchRequest()
                    this.toggleEdit()
                  })
            
        },

    }   
}
</script>

<style>
.card {
    margin-bottom: 18px;
}
.card-header {
    font-weight: 700;
}
</style>
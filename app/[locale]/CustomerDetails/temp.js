              <div className={CustomerDetailsModule.CustomerContainer1}>
                <div className={CustomerDetailsModule.CustomerContainerLabel}>
                  {t("CustomerPage.YourInformation")}
                </div>

                <div className={InfoInputContainerClass}>

                  {/* Left side of the box */}
                  <div className={CustomerDetailsModule.InputContainer}>
                      <div className={CustomerDetailsModule.InputLabel}>
                        <div className={LabelTextClass}>
                          {t("CustomerPage.First Name")}
                        </div>
                      </div>
                      <div className={CustomerDetailsModule.InputLabel}>
                        <div className={LabelTextClass}>
                          {t("CustomerPage.Last Name")}
                        </div>
                      </div>
                      <div className={CustomerDetailsModule.InputLabel}>

                        <div className={LabelTextClass}>
                          {t("CustomerPage.Mobile Phone Number")}
                        </div>
                      </div>
                      <div className={CustomerDetailsModule.InputLabel}>
                        <div className={LabelTextClass}>
                          {t("CustomerPage.Email Address")}
                        </div>
                      </div>
                      <div className={CustomerDetailsModule.InputLabel}>
                        <div className={LabelTextClass}>
                          {t("CustomerPage.Confirm Email Address")}
                        </div>
                      </div>
                      <div className={CustomerDetailsModule.InputLabel}>
                        <div className={LabelTextClass}>
                          {t("CustomerPage.Country/Region")}
                        </div>
                      </div>
                  </div>

                  {/* input box side aka right side */}
                  <div className={inputBoxClass}>
                    <div className={CustomerDetailsModule.Individual_InputBox}>
                      <input
                      name="first_name"
                      type="text"
                      autoComplete="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className={`${inputBoxClass} ${formErrors.first_name ? CustomerDetailsModule.inputError : ''}`}
                      dir={locale === 'ar' ? 'rtl' : 'ltr'}  // Set the direction based on the locale
                    />

                    </div>

                    <div className={CustomerDetailsModule.Individual_InputBox}>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className={`${inputBoxClass} ${formErrors.last_name ? CustomerDetailsModule.inputError : ''}`}
                      />
                    </div>

                    <div className={CustomerDetailsModule.Individual_InputBox}>

                      
                        {/* Dropdown for selecting country code */}
                      <PhoneInput
                        country={'ly'} // Set the initial country code (e.g., 'us' for United States)
                        value={formData.phone_number}
                        inputStyle={{width:"100%", borderRadius:"0", height:"2.44rem", border: "0.5px"}}
                        inputProps={{
                          name: 'phone',
                          required: true,
                          autoFocus: true
                        }}
                        onChange={phone => setPhone(phone)} // Handle the change event
                        onlyCountries={allowedCountriesNumbers}
                      />


                    </div>

                    <div className={CustomerDetailsModule.Individual_InputBox}>
                      <input
                        type="email"
                        required  
                        name="email_address"
                        value={formData.email_address}
                        onChange={handleInputChange}
                        className={`${inputBoxClass} ${formErrors.email_address ? CustomerDetailsModule.inputError : ''}`}
                      />
                    </div>

                    <div className={CustomerDetailsModule.Individual_InputBox}>
                      <input
                        type="email"
                        name="confirmEmailAddress"
                        value={formData.confirmEmailAddress}
                        onChange={handleInputChange}
                        className={`${inputBoxClass} ${formErrors.confirmEmailAddress ? CustomerDetailsModule.inputError : ''}`}
                        required
                      />
                    </div>

                    <div className={CustomerDetailsModule.Individual_InputBox}>
                    <select
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      className={`${inputBoxClass} ${formErrors.nationality ? CustomerDetailsModule.inputError : ''}`}
                      required
                    >
                      <option value="">{t("CustomerPage.Select Nationality")}</option>
                      {/* Default option */}
                      {allowedCountries.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    </div>
                  </div>

                    

                </div>

              </div>


              <div className={CustomerDetailsModule.CustomerContainer2}>
                <div className={CustomerDetailsModule.CustomerContainerLabel}>
                  {t("CustomerPage.CARD DETAILS")}
                </div>

                <div className={InfoInputContainerClass}>

                  {/* Left side of the box */}
                  <div className={CustomerDetailsModule.InputContainer}>
                      <div className={CustomerDetailsModule.InputLabel}>
                        <div className={LabelTextClass}>
                          {t("CustomerPage.Name on card")}
                        </div>
                      </div>
                      <div className={CustomerDetailsModule.InputLabel}>
                        <div className={LabelTextClass}>
                          {t("CustomerPage.Card number")}
                        </div>
                      </div>
                      <div className={CustomerDetailsModule.InputLabel}>
                        <div className={LabelTextClass}>
                          {t("CustomerPage.Card expiry date")}
                        </div>
                      </div>
                  </div>

                  {/* input box side aka right side */}
                  <div className={inputBoxClass}>

                    <div className={CustomerDetailsModule.Individual_InputBox}>
                      <input
                      type="text"
                      name="nameOnCard"
                      onChange={handleInputChange}
                      className={inputBoxClass}
                      required
                    />
                    </div>

                    <div className={CustomerDetailsModule.Individual_InputBox}>
                      <input
                      type="text"
                      name="cardNumber"
                      autoComplete='numberOnCard'
                      onChange={handleInputChange}
                      className={inputBoxClass}
                      required
                    />
                    </div>
                    
                    <div className={CustomerDetailsModule.Individual_InputBox}>
                      <input
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={inputBoxClass}
                      required
                    />
                    </div>
                  </div>
                </div>
              </div>

              <div className={CustomerDetailsModule.CustomerContainer3}>
                <div className={AcceptedCardClass}>
                    {t("CustomerPage.AcceptedCards")}
                  </div>
              </div>
//  Copyright 2022. The Tari Project
//
//  Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
//  following conditions are met:
//
//  1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following
//  disclaimer.
//
//  2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
//  following disclaimer in the documentation and/or other materials provided with the distribution.
//
//  3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote
//  products derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
//  INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
//  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
//  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
//  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
//  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
//  USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { FormLabel, TextField } from "@mui/material";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import SecondaryHeading from "./SecondaryHeading.tsx";
import { FunctionDef } from "../templateDefinition.ts";

interface Props {
  func: FunctionDef;
  onCall: (data: any) => void;
}

function CallTemplateForm(props: Props) {
  const { func, onCall } = props;
  const [data, setData] = useState({});

  const isMethod = func.arguments[0]?.name == "self";
  const args = func.arguments.slice(isMethod ? 1 : 0);

  return (
    <>
      <SecondaryHeading>
        Call {func.name} {isMethod ? "Method" : "Function"}
      </SecondaryHeading>
      <form
        onSubmit={evt => {
          evt.preventDefault();
          onCall(data);
        }}
      >
        <Grid item xs={12} md={12} lg={12}>
          {args.map((arg, i) => (
            <div key={i}>
              <Grid item xs={12} md={12} lg={12}>
                <FormLabel htmlFor={arg.name}>{arg.name}</FormLabel>
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <TextField
                  id={arg.name}
                  name={arg.name}
                  placeholder={arg.name}
                  onChange={evt =>
                    setData({ ...data, [arg.name]: evt.target.value })
                  }
                />
              </Grid>
            </div>
          ))}
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Button type="submit">Submit</Button>
        </Grid>
      </form>
    </>
  );
}

export default CallTemplateForm;
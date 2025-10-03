import axios from "axios";
import API, { ApiUrl, ConsumptionURL } from "../Api";

export const gettabularProjects = async () => {
  return await API.post(`/cibi/tabular/projects`, {});
};

export const getTabularProjectDetails = async (project_id) => {
  return await API.post(`/cibi/tabular/projects`, {}).then(res=> {
    res.data = res.data.filter((project) => project.proj_id === project_id)[0]
    return res
  });
}


export const CreateNewProject = async (project, description) => {
  return await API.post(
    `/cibi/tabular/create_project`,
    { project_name: project, description: description },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const GetListExperiments = async (project_id = "", exp_id = "") => {
  return await API.post(
    `/cibi/tabular/experiments`,
    { project_id: project_id, experiment_id: exp_id },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const CreateExperiment = async (project_id, expName) => {
  return await API.post(
    `/cibi/tabular/create_exp`,
    { project_id: project_id, experiment_name: expName },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

// Upload file to s3 bucket for table
export const UploadFileTos3 = async (file, exp_id, uploadFilePage) => {
  try {
    let urlRes;
    if (uploadFilePage === "uploadPage") {
      urlRes = await API.post(
        `/cibi/connectors/create_signed_url_experiment?filename=${file.name}&exp_id=${exp_id}`,
        {}
      );
    }
    if (uploadFilePage === "MeataDataPage") {
      urlRes = await API.post(
        `/cibi/connectors/get_url?filename=${file.name}`,
        {}
      );
    }
    if (uploadFilePage === "FeatureEnggPage") {
      urlRes = await API.post(
        `/cibi/connectors/generate_signed_url?filename=${file.name}&exp_id=${exp_id}`,
        {}
      );
    }
    if (urlRes.status === 200) {
      let urlData = urlRes.data;
      var formdata = new FormData();
      formdata.append("key", urlData.fields["key"]);
      formdata.append("x-amz-algorithm", urlData.fields["x-amz-algorithm"]);
      formdata.append("x-amz-credential", urlData.fields["x-amz-credential"]);
      formdata.append("x-amz-date", urlData.fields["x-amz-date"]);
      formdata.append("policy", urlData.fields["policy"]);
      formdata.append("x-amz-signature", urlData.fields["x-amz-signature"]);
      formdata.append("file", file);

      var signeddata = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      return { s3Res: await fetch(urlData.url, signeddata), getUrlRes: urlRes };
    } else {
      return "Error";
      // setMessage("File Uploaded Failed try again");
    }
  } catch (err) {
    console.log(err);
  }
};

export const GetDataPreview = async (inputPath) => {
  return await API.post(
    `/cibi/tabular/data_preview?input_path=${inputPath}`,
    {}
  );
};

export const UpdateConfig = async (exp_id, configType, formData) => {
  return await API.post(
    `/cibi/tabular/update_config?exp_id=${exp_id}&config_type=${configType}`,
    formData,
    {}
  );
};

export const Train = async (exp_id, is_dq) => {
  return await API.post(
    `/cibi/tabular/train`,
    { exp_id: exp_id, is_dq: is_dq },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const DeployModel = async (exp_id) => {
  return await API.post(
    `/cibi/tabular/deploy`,
    { exp_id: exp_id },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const DeployloadTest = async (exp_id) => {
  return await API.post(
    `/cibi/tabular/loadtest`,
    { exp_id: exp_id },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const TrainStatus = async (exp_id) => {
  return await API.post(
    `/cibi/tabular/training_status`,
    { exp_id: exp_id },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const UpdateExp = async (exp_id) => {
  return await API.post(
    `/cibi/tabular/update_exp`,
    { exp_id: exp_id, status: "PREPARED" },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const GetExpDataSet = async (exp_id) => {
  return await API.get(
    `/cibi/connectors/get_dataset_for_experiment?exp_id=${exp_id}`,
    {}
  );
};

export const GetRefreshToken = async () => {
  return await API.post(`/cibi/tabular/extend_token`, {});
};

export const GetFeatureImportance = async (exp_id) => {
  return await API.get(`/cibi/tabular/feature_importance?exp_id=${exp_id}`, {});
};

export const GetCmpr = async (exp_id) => {
  return await API.get(`/cibi/tabular/cmpr?exp_id=${exp_id}`, {});
};

export const GetBatchStatus = async (exp_id) => {
  return await API.get(`/cibi/tabular/batch_status?exp_id=${exp_id}`, {});
};

export const GetEndPointStatus = async (exp_id) => {
  return await API.post(
    `/cibi/tabular/sample_request`,
    { exp_id: exp_id },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const GenerateDeployToken = async () => {
  return await API.post(`/cibi/tabular/deployment_token`, {});
};

export const Preprocess = async (exp_id) => {
  return await API.post(
    `/cibi/tabular/preprocess`,
    { exp_id: exp_id },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

// Connectors
export const GetAllConnectors = async () => {
  return await API.get(`/cibi/connectors/getAllConnectors`, {});
};

export const GetUserDatasets = async () => {
  return await API.get(`/cibi/connectors/get_user_datasets`, {});
};

export const GetSourcesforConnector = async (source) => {
  return await API.get(
    `/cibi/connectors/getSourcesforConnector?source=${source}`,
    {}
  );
};

export const GetSourceFields = async (source) => {
  return await API.get(`/cibi/connectors/getSourceFields?source=${source}`, {});
};

export const VerifyDataSource = async (exp_id, request) => {
  return await API.post(
    `/cibi/connectors/verifyDataSource?exp_id=${exp_id}`,
    {
      datasourcename: request.datasourcename,
      datasource: request.datasource,
      connection_data: request.connection_data,
    },
    {}
  );
};

export const ExecuteQuery = async (dataSourceModel, Queryvalue) => {
  return await API.post(
    `/cibi/connectors/executeQuery`,
    {
      dataSourceModel: {
        datasourcename: dataSourceModel.datasourcename,
        datasource: dataSourceModel.datasource,
        connection_data: dataSourceModel.connection_data,
      },
      query: Queryvalue,
      uuid: "",
      // user_id: "string",
      // exp_id: "string",
    },
    {}
  );
};

export const SaveQuery = async (dataSourceModel, Queryvalue, exp_id) => {
  return await API.post(
    `/cibi/connectors/saveQuery`,
    {
      dataSourceModel: {
        datasourcename: dataSourceModel.datasourcename,
        datasource: dataSourceModel.datasource,
        connection_data: dataSourceModel.connection_data,
      },
      query: Queryvalue,
      uuid: "",
      // user_id: "string",
      exp_id: exp_id,
    },
    {}
  );
};

export const ExportData = async (exp_id) => {
  return await API.post(`/cibi/connectors/exportData?exp_id=${exp_id}`, {});
};

export const GetMispredictionTree = async (exp_id) => {
  return await API.get(`/cibi/tabular/misprediction_tree?exp_id=${exp_id}`, {});
};

// ----------------------------shift left-------------------------------------------

export const GetRawFeatureStatus = async (exp_id) => {
  return await API.post(
    `/cibi/tabular/preprocess/raw_feature_metadata`,
    { exp_id: exp_id },
    {}
  );
};

export const GetRawFeatureData = async (exp_id) => {
  return await API.get(`/cibi/tabular/preprocess/raw_features/${exp_id}`, {});
};

export const GetEnggFeatureStatus = async (exp_id) => {
  return await API.post(
    `/cibi/tabular/preprocess/engg_features`,
    { exp_id: exp_id },
    {}
  );
};

export const GetEnggFeatureData = async (exp_id) => {
  return await API.get(`/cibi/tabular/expert_features/${exp_id}`, {});
};

export const UserModifiedData = async (exp_id, modifiedData) => {
  return await API.post(
    `/cibi/tabular/preprocess/user_mod_raw_feature_metadata?exp_id=${exp_id}`,
    {
      raw_features: modifiedData,
    },
    {}
  );
};

export const GetHistoricalQueries = async (exp_id) => {
  return await API.post(
    `/cibi/tabular/preprocess/relevant_historical_queries`,
    { exp_id: exp_id },
    {}
  );
};

export const FetchSqlQueries = async (exp_id) => {
  return await API.get(
    `/cibi/tabular/preprocess/fetch_sql_queries/${exp_id}`,
    {}
  );
};

// Call populate SQL Editor
export const PopulateSQLStatus = async (exp_id) => {
  return await API.post(
    `/cibi/tabular/preprocess/sql_code_gen`,
    { exp_id: exp_id },
    {}
  );
};

// Get Generated Sql
export const GetGeneratedSQL = async (exp_id) => {
  return await API.get(
    `/cibi/tabular/preprocess/sql_code_to_autopopulate/${exp_id}`,
    {}
  );
};

export const GetSqlAssist = async (exp_id, query) => {
  return await API.post(
    `/cibi/tabular/preprocess/sql_assist`,
    { exp_id: exp_id, query: query },
    {}
  );
};

export const FetchSqlAssist = async (exp_id) => {
  return await API.get(
    `/cibi/tabular/preprocess/fetch_sql_assist/${exp_id}`,
    {}
  );
};

// Write S3 Uris
export const WriteS3Uris = async (
  hostname,
  metadata_uri,
  historical_queries_uri,
  db_type,
  db_name
) => {
  return await API.post(
    `/cibi/tabular/preprocess/dwh_s3_uris?hostname=${hostname}&db_name=${db_name}&metadata_uri=${metadata_uri}&historical_queries_uri=${historical_queries_uri}&db_type=${db_type}`,
    {}
  );
};
// Call Indexing
export const CallIndexing = async (hostname, db_name) => {
  return await API.post(
    `/cibi/tabular/preprocess/indexing?hostname=${hostname}&db_name=${db_name}`,
    {}
  );
};

// Get Indexing Status
export const GetIndexing = async (hostname, db_name) => {
  return await API.get(
    `/cibi/tabular/preprocess/indexing_status?hostname=${hostname}&db_name=${db_name}`,
    {}
  );
};

// ------------------------------data quality-------------------------------

export const GetAnomaliesPct = async (exp_id) => {
  return await API.get(`/cibi/tabular/anomaly_pct/${exp_id}`, {});
};

export const Loadtest_Status = async (exp_id) => {
  return await API.get(`/cibi/tabular/loadtest_status?exp_id=${exp_id}`, {});
};
export const replica_suggestion = async (
  exp_id, NumberOfUsers
) => {
  return await API.post(
    `cibi/tabular/replica_suggestion?exp_id=${exp_id}&min_concurrency=${NumberOfUsers}`,
    {}
  );
};


export const get_consumption_risk_type = async (
  desc
) => {
  return await ConsumptionURL.post(
    `/type?description=${desc}`,
    {}
  );
};



export const get_consumption_targets = async (
  type, exp_id
) => {
  return await ConsumptionURL.post(
    `/${type}/target?exp_id=${exp_id}`,
    {}
  );
};



export const get_consumption_risks = async (
  type, selectedTarget
) => {
  if(selectedTarget == "nbs"){
    return await ConsumptionURL.get(
      `/${type}/risk`,
      {}
    );  
  }
  return await ConsumptionURL.get(
    `/${type}/risk?disease_nm=${selectedTarget}`,
    {}
  );
};



export const get_consumption_contributions = async (
  type, mem_id, selectedTarget
) => {
  return await ConsumptionURL.post(
    `/${type}/contribution?mem_id=${mem_id}&disease_nm=${selectedTarget}`,
    {}
  );
};



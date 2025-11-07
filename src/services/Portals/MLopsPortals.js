import axios from "axios";
import API, { ApiUrl, ConsumptionURL, ConnectorAPI } from "../Api";

export const gettabularProjects = async () => {
  return await API.post(`/projects`, {});
};

export const getTabularProjectDetails = async (project_id) => {
  return await API.post(`/projects`, {}).then(res=> {
    res.data = res.data.filter((project) => project.proj_id === project_id)[0]
    return res
  });
}


export const CreateNewProject = async (project, description) => {
  return await API.post(
    `/create_project`,
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
    `/experiments`,
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
    `/create_exp`,
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
      urlRes = await ConnectorAPI.post(
        `/connectors/create_signed_url_experiment?filename=${file.name}&exp_id=${exp_id}`,
        {}
      );
    }
    if (uploadFilePage === "MeataDataPage") {
      urlRes = await API.post(
        `/connectors/get_url?filename=${file.name}`,
        {}
      );
    }
    if (uploadFilePage === "FeatureEnggPage") {
      urlRes = await API.post(
        `/connectors/generate_signed_url?filename=${file.name}&exp_id=${exp_id}`,
        {}
      );
    }
    if (urlRes.status === 200) {
      let urlData = urlRes.data;
      // ✅ Azure Blob Storage upload (PUT method)
      const uploadOptions = {
        method: "PUT",  // ✅ Changed from POST to PUT
        headers: {
          "x-ms-blob-type": urlData.fields["x-ms-blob-type"] || "BlockBlob",  // ✅ Azure header
          "Content-Type": file.type || "application/octet-stream"
        },
        body: file,  // ✅ Send raw file, not FormData
        redirect: "follow",
      };
      return { 
        s3Res: await fetch(urlData.url, uploadOptions), 
        getUrlRes: urlRes 
      };
    } else {
      return "Error";
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const GetDataPreview = async (inputPath) => {
  return await API.post(
    `/data_preview?input_path=${inputPath}`,
    {}
  );
};

export const UpdateConfig = async (exp_id, configType, formData) => {
  return await API.post(
    `/update_config?exp_id=${exp_id}&config_type=${configType}`,
    formData,
    {}
  );
};

export const Train = async (exp_id, is_dq) => {
  return await API.post(
    `/train`,
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
    `/deploy`,
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
    `/loadtest`,
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
    `/training_status`,
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
    `/update_exp`,
    { exp_id: exp_id, status: "PREPARED" },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const GetExpDataSet = async (exp_id) => {
  return await ConnectorAPI.get(
    `/connectors/get_dataset_for_experiment?exp_id=${exp_id}`,
    {}
  );
};

export const GetRefreshToken = async () => {
  return await API.post(`/extend_token`, {});
};

export const GetFeatureImportance = async (exp_id) => {
  return await API.get(`/feature_importance?exp_id=${exp_id}`, {});
};

export const GetCmpr = async (exp_id) => {
  return await API.get(`/cmpr?exp_id=${exp_id}`, {});
};

export const GetBatchStatus = async (exp_id) => {
  return await API.get(`/batch_status?exp_id=${exp_id}`, {});
};

export const GetEndPointStatus = async (exp_id) => {
  return await API.post(
    `/sample_request`,
    { exp_id: exp_id },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const GenerateDeployToken = async () => {
  return await API.post(`/deployment_token`, {});
};

export const Preprocess = async (exp_id) => {
  return await API.post(
    `/preprocess`,
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
  return await ConnectorAPI.get(`/connectors/getAllConnectors`, {});
};

export const GetUserDatasets = async () => {
  return await ConnectorAPI.get(`/connectors/get_user_datasets`, {});
};

export const GetSourcesforConnector = async (source) => {
  return await ConnectorAPI.get(
    `/connectors/getSourcesforConnector?source=${source}`,
    {}
  );
};

export const GetSourceFields = async (source) => {
  return await ConnectorAPI.get(`/connectors/getSourceFields?source=${source}`, {});
};

export const VerifyDataSource = async (exp_id, request) => {
  return await API.post(
    `/connectors/verifyDataSource?exp_id=${exp_id}`,
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
    `/connectors/executeQuery`,
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
    `/connectors/saveQuery`,
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
  return await API.post(`/connectors/exportData?exp_id=${exp_id}`, {});
};

export const GetMispredictionTree = async (exp_id) => {
  return await API.get(`/misprediction_tree?exp_id=${exp_id}`, {});
};

// ----------------------------shift left-------------------------------------------

export const GetRawFeatureStatus = async (exp_id) => {
  return await API.post(
    `/preprocess/raw_feature_metadata`,
    { exp_id: exp_id },
    {}
  );
};

export const GetRawFeatureData = async (exp_id) => {
  return await API.get(`/preprocess/raw_features/${exp_id}`, {});
};

export const GetEnggFeatureStatus = async (exp_id) => {
  return await API.post(
    `/preprocess/engg_features`,
    { exp_id: exp_id },
    {}
  );
};

export const GetEnggFeatureData = async (exp_id) => {
  return await API.get(`/expert_features/${exp_id}`, {});
};

export const UserModifiedData = async (exp_id, modifiedData) => {
  return await API.post(
    `/preprocess/user_mod_raw_feature_metadata?exp_id=${exp_id}`,
    {
      raw_features: modifiedData,
    },
    {}
  );
};

export const GetHistoricalQueries = async (exp_id) => {
  return await API.post(
    `/preprocess/relevant_historical_queries`,
    { exp_id: exp_id },
    {}
  );
};

export const FetchSqlQueries = async (exp_id) => {
  return await API.get(
    `/preprocess/fetch_sql_queries/${exp_id}`,
    {}
  );
};

// Call populate SQL Editor
export const PopulateSQLStatus = async (exp_id) => {
  return await API.post(
    `/preprocess/sql_code_gen`,
    { exp_id: exp_id },
    {}
  );
};

// Get Generated Sql
export const GetGeneratedSQL = async (exp_id) => {
  return await API.get(
    `/preprocess/sql_code_to_autopopulate/${exp_id}`,
    {}
  );
};

export const GetSqlAssist = async (exp_id, query) => {
  return await API.post(
    `/preprocess/sql_assist`,
    { exp_id: exp_id, query: query },
    {}
  );
};

export const FetchSqlAssist = async (exp_id) => {
  return await API.get(
    `/preprocess/fetch_sql_assist/${exp_id}`,
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
    `/preprocess/dwh_s3_uris?hostname=${hostname}&db_name=${db_name}&metadata_uri=${metadata_uri}&historical_queries_uri=${historical_queries_uri}&db_type=${db_type}`,
    {}
  );
};
// Call Indexing
export const CallIndexing = async (hostname, db_name) => {
  return await API.post(
    `/preprocess/indexing?hostname=${hostname}&db_name=${db_name}`,
    {}
  );
};

// Get Indexing Status
export const GetIndexing = async (hostname, db_name) => {
  return await API.get(
    `/preprocess/indexing_status?hostname=${hostname}&db_name=${db_name}`,
    {}
  );
};

// ------------------------------data quality-------------------------------

export const GetAnomaliesPct = async (exp_id) => {
  return await API.get(`/anomaly_pct/${exp_id}`, {});
};

export const Loadtest_Status = async (exp_id) => {
  return await API.get(`/loadtest_status?exp_id=${exp_id}`, {});
};
export const replica_suggestion = async (
  exp_id, NumberOfUsers
) => {
  return await API.post(
    `/replica_suggestion?exp_id=${exp_id}&min_concurrency=${NumberOfUsers}`,
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


